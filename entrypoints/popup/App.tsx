import React, {useState} from "react";

const App = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [showModal, setShowModal] = useState(false);

    const generateResponse = async () => {
        // Call OpenAI API
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
                        content: "You are a helpful assistant."
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
        console.log(data)
        setResponse(data.choices[0].message.content);
    };

    // const generateResponse = async () => {
    //     const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    //         model: 'llama-3.1-8b-instant',
    //         messages: [{
    //             role: "system",
    //             content: "You are a helpful assistant."
    //         }, {
    //             role: "user",
    //             content: prompt
    //         }],
    //         max_tokens: 100,
    //     }, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
    //         }
    //     })
    //     setResponse(res.data.choices[0].message.content);
    // }

    const insertResponse = async () => {
        await chrome.runtime.sendMessage({action: 'insertMessage', content: response})
        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     console.log('Tabs:', tabs);  // Log the tabs to ensure you're getting them
        //     if (tabs.length === 0 || !tabs[0].id) {
        //         console.error('No active tab found!');
        //         return;
        //     }
        //     chrome.tabs.sendMessage(tabs[0].id, { action: 'insertMessage', content: response }, (response) => {
        //         if (chrome.runtime.lastError) {
        //             console.error('Error sending message:', chrome.runtime.lastError.message);
        //         } else {
        //             console.log('Message sent successfully:', response);
        //         }
        //     });
        // });
    };


    return (
        <div className="p-4 h-[100vh] w-full">
            <div
                onClick={() => setShowModal(true)}
                className="fixed bottom-4 right-4 bg-gray-300 p-2 rounded-full cursor-pointer">
                Open
                {/*<img src="/wxt.svg" alt="AI Icon" className="w-12 h-12"/>*/}
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="border p-2 w-full"
                            placeholder="Enter command"
                        />
                        <button onClick={generateResponse} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
                            Generate
                        </button>


                        {response && (
                            <div className="mt-4">
                                <button onClick={() => setShowModal(false)} className="float-right">X</button>
                                <p>{response}</p>
                                <button onClick={insertResponse}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                                    Insert into LinkedIn
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default App;
