import React from 'react';
import ReactDOM from 'react-dom';
import App from "@/entrypoints/popup/App.tsx";

export default defineContentScript({
    matches: ['*://www.linkedin.com/*'],
    main() {
        chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
            if (message.action === 'insertMessage') {
                const messageDiv = document.body.querySelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate');

                if (messageDiv) {
                    const pTag = messageDiv.querySelector('p');
                    const ariaLabel = messageDiv.nextElementSibling;
                    ariaLabel?.classList.remove('msg-form__placeholder');
                    messageDiv.removeAttribute('aria-placeholder');
                    messageDiv.removeAttribute('aria-label');

                    if (pTag) {
                        pTag.removeAttribute('aria-placeholder');
                        pTag.removeAttribute('aria-label');
                        pTag.innerHTML = message.content;
                        sendResponse({status: 'success'});
                    } else {
                        console.error('Message <p> tag not found!');
                        sendResponse({status: 'error', message: 'Message <p> tag not found!'});
                    }
                } else {
                    console.error('Message input field not found!');
                    sendResponse({status: 'error', message: 'Message input field not found!'});
                }
            }
        });

        const extensionDiv = document.createElement('div');
        extensionDiv.id = 'ai-response-generator-root';

        // Function to append extensionDiv to the parent div of messageDiv with class 'flex-grow-1 relative'
        function appendExtensionDiv() {
            const messageDiv = document.body.querySelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate');
            if (messageDiv) {
                // Find the parent with class 'flex-grow-1 relative'
                const parentDiv = messageDiv.closest('.flex-grow-1.relative');
                if (parentDiv) {
                    parentDiv.appendChild(extensionDiv);
                    console.log('Extension div appended to parent div of message input field');

                    // After appending, render the React component
                    if (document.getElementById('ai-response-generator-root')) {
                        ReactDOM.render(
                            React.createElement(App),
                            document.getElementById('ai-response-generator-root')
                        );
                    }
                    return true;
                } else {
                    console.error('Parent div with class "flex-grow-1 relative" not found!');
                }
            }
            return false;
        }

        // Observe DOM mutations to detect when the messageDiv is available
        const observer = new MutationObserver(() => {
            if (appendExtensionDiv()) {
                observer.disconnect(); // Stop observing once we find the parentDiv and append the extensionDiv
            }
        });

        // Start observing changes in the body for added nodes
        observer.observe(document.body, {childList: true, subtree: true});

        // Apply styles to the extensionDiv
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
    #ai-response-generator-root {
        position: absolute; /* Changed from fixed to absolute */
        bottom: 1%;
        right:0%;
        z-index: 1000;
    }
    #ai-response-generator-root img {
        cursor: pointer;
    }
`;
        document.head.appendChild(styleElement);
    }
});
