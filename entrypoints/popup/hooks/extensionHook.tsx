import React, {useState} from 'react'
import axios from "axios";

const useExtension = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] =  useState<boolean>(false);
    const [responseDiv, setResponseDiv] =  useState<boolean>(false);
    const [isRegenerate, setIsRegenerate] =  useState<boolean>(false);
    const [promptError, setPromptError] =  useState<boolean>(false);

    {/* Generate response from Groq API */}
    const generateResponse = async () => {
        if (prompt.trim() === '') return setPromptError(true);

        setLoading(true);
        setResponseDiv(true);
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
        setResponseDiv(false);
        setIsRegenerate(false);
        setShowModal(false);
    };

    {/* Change input field value */}
    const changeInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value)
        setPromptError(false);
    }

    return {
        prompt,
        response,
        showModal,
        setShowModal,
        loading,
        showResponse: responseDiv,
        isRegenerate,
        placeholderError: promptError,
        generateResponse,
        insertResponse,
        closeModal,
        changeInput
    }

}
export default useExtension
