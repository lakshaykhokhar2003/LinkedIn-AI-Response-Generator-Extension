import React, {useState} from "react";
import Wand from "@/entrypoints/popup/Wand.tsx";
import Down from "@/entrypoints/popup/Down.tsx";
import Refresh from "@/entrypoints/popup/Refresh.tsx";
import Send from "@/entrypoints/popup/Send.tsx";

const App = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [isRegenerate, setIsRegenerate] = useState(false); // New state for button

    let Placeholder = 'Your Prompt';
    const generateResponse = async () => {
        if (prompt.trim() === '') Placeholder = 'Please enter a prompt';

        setLoading(true);
        setShowResponse(true);
        setIsRegenerate(true);
        try {
            const result = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
                },
                body: JSON.stringify({
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
                }),
            });
            const data = await result.json();
            setResponse(data.choices[0].message.content);
        } catch (error) {
            console.error(error);
            setResponse('Error generating response');
        } finally {
            setLoading(false);
            Placeholder = 'Your Prompt';
        }
    };

    const insertResponse = async () => {
        await chrome.runtime.sendMessage({action: 'insertMessage', content: response});
        closeModal();
    };

    const closeModal = () => {
        setPrompt('');
        setResponse('');
        setShowResponse(false);
        setIsRegenerate(false);
        setShowModal(false);
    };


    return (
        <div className="p-4">
            <div
                onClick={() => setShowModal(true)}
                className="absolute bottom-4 right-2 bg-white p-2 rounded-full cursor-pointer z-10"
            >
                <Wand/>
            </div>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center outline-none"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-white p-4 rounded-lg mx-auto w-full max-w-[320px] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') closeModal();
                        }}
                    >
                        {showResponse && (
                            <div className="flex flex-col space-y-4 mt-4 tracking-normal">
                                {/* User's Typed Message */}
                                <div className="max-w-[75%] w-auto p-4 rounded-lg bg-gray-200 self-end">
                                    {prompt && <p className="text-gray-500">{prompt}</p>}
                                </div>

                                {/* AI Response */}
                                <div className="max-w-[75%] w-auto p-4 rounded-lg bg-blue-200 self-start">
                                    {loading ? (
                                        <div className="animate-pulse text-blue-500">Loading AI Response...</div>
                                    ) : (
                                        response && <p className="text-gray-500">{response}</p>
                                    )}
                                </div>
                            </div>

                        )}

                        <input
                            disabled={isRegenerate}
                            type="text"
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-2 mt-4 outline-none border border-gray-300 rounded"
                            placeholder={Placeholder}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') await generateResponse();
                            }}
                        />
                        <div className="flex justify-end gap-5 mt-4">
                            {(response && showResponse) && (
                                <button
                                    onClick={insertResponse}
                                    className="flex flex-row justify-center items-center text-gray-500 border-solid border border-gray-600 font-semibold px-2 py-1 rounded-lg"
                                >
                                    <Down/>
                                    Insert
                                </button>
                            )}
                            <button
                                onClick={generateResponse}
                                className={`flex flex-row gap-2 justify-center items-center bg-blue-500 font-semibold text-white px-4 py-1 rounded-lg ${isRegenerate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isRegenerate}
                            >
                                {isRegenerate ? <Refresh/> : <Send/>}
                                {isRegenerate ? 'Regenerate' : 'Generate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
