import React, {useState} from 'react'
import axios from "axios";

const useExtension = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [isRegenerate, setIsRegenerate] = useState(false);
    const [placeholderError, setPlaceholderError] = useState(false);

    {/* Generate response from Groq API */}
    const generateResponse = async () => {
        if (prompt.trim() === '') return setPlaceholderError(true);

        setLoading(true);
        setShowResponse(true);
        setIsRegenerate(true);

        try {
            const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant, also known as a chatbot, assist and give advice to users as they want."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 100,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
                }
            })

            setResponse(res.data.choices[0].message.content);
        } catch (error) {
            console.error(error);
            setResponse('Error generating response');
        } finally {
            setLoading(false);
        }
    };

    {/* Insert response into LinkedIn message input field */}
    const insertResponse = async () => {
        await chrome.runtime.sendMessage({action: 'insertMessage', content: response});
        closeModal();
    };

    {/* Close modal */}
    const closeModal = () => {
        setPrompt('');
        setResponse('');
        setShowResponse(false);
        setIsRegenerate(false);
        setShowModal(false);
    };

    {/* Change input field value */}
    const changeInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value)
        setPlaceholderError(false);
    }

    return {
        prompt,
        response,
        showModal,
        setShowModal,
        loading,
        showResponse,
        isRegenerate,
        placeholderError,
        generateResponse,
        insertResponse,
        closeModal,
        changeInput
    }

}
export default useExtension
