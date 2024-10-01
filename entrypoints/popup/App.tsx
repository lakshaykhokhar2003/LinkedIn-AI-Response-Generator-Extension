import React from "react";
import Wand from "@/entrypoints/popup/Svg/Wand.tsx";
import Down from "@/entrypoints/popup/Svg/Down.tsx";
import Refresh from "@/entrypoints/popup/Svg/Refresh.tsx";
import Send from "@/entrypoints/popup/Svg/Send.tsx";
import useExtension from "@/entrypoints/popup/hooks/extensionHook.tsx";

const App = () => {
    const {
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
    } = useExtension();


    return (
        <div className="p-4">
            {/* Floating Action Button */}
            <button
                onClick={() => setShowModal(true)}
                className="absolute bottom-4 right-2 bg-white p-2 rounded-full cursor-pointer z-10"
            >
                <Wand/>
            </button>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center outline-none"
                    onClick={closeModal}>
                    <div
                        className="relative bg-white p-4 rounded-lg mx-auto w-full max-w-[320px] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') closeModal();
                        }}>
                        {/* Response */}
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

                        {/* Input Field */}
                        <input
                            disabled={isRegenerate}
                            type="text"
                            onChange={changeInput}
                            className={`w-full p-2 mt-2 border-solid border border-gray-300 rounded-lg ${placeholderError ? 'border-red-500' : ''}`}
                            placeholder="Your Prompt"
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') await generateResponse();
                            }}
                        />

                        {/* Error Message */}
                        {placeholderError && <p className="mt-2 text-red-500 text-sm">Prompt cannot be empty</p>}

                        {/* Buttons */}
                        <div className="flex justify-end gap-5 mt-4">
                            {(response && showResponse) && (
                                <button
                                    onClick={insertResponse}
                                    className="flex flex-row justify-center items-center text-gray-500 border-solid border border-gray-600 font-semibold px-2 py-1 rounded-lg"
                                >
                                    <Down/> Insert
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
