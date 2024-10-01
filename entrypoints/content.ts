import React from 'react';
import ReactDOM from 'react-dom';
import App from "@/entrypoints/popup/App.tsx";

export default defineContentScript({
    matches: ['*://www.linkedin.com/*'],
    main() {
        chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
            if (message.action === 'insertMessage') {
                const messageInput = document.body.querySelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate');

                if (messageInput) {
                    const pTag = messageInput.querySelector('p');

                    const ariaLabel = messageInput.nextElementSibling;
                    ariaLabel!.classList.remove('msg-form__placeholder');
                    messageInput.removeAttribute('aria-placeholder');
                    messageInput.removeAttribute('aria-label');

                    pTag!.innerHTML = message.content;
                    sendResponse({status: 'success'});
                } else {
                    console.error('Message input field not found!');
                    sendResponse({status: 'error', message: 'Message input field not found!'});
                }
            }
        });

        const extensionDiv = document.createElement('div');
        extensionDiv.id = 'ai-response-generator-root';

        function appendExtensionDiv() {
            const messageDiv: HTMLDivElement | null = document.body.querySelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate');
            const parentDiv = (messageDiv as HTMLDivElement)!.closest('.flex-grow-1.relative'); // Can fix console error by adding a check for messageDiv, but it's not necessary makes the code more verbose
            parentDiv!.appendChild(extensionDiv);

            if (document.getElementById('ai-response-generator-root')) {
                ReactDOM.render(
                    React.createElement(App),
                    document.getElementById('ai-response-generator-root')
                );
                return true;
            }
            console.error('Error rendering extension div');
            return false;
        }

        const observer = new MutationObserver(() => {
            if (appendExtensionDiv()) observer.disconnect();
        });
        observer.observe(document.body, {childList: true, subtree: true});

        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
    #ai-response-generator-root {
        position: absolute; 
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
