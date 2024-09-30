import React from 'react';
import ReactDOM from 'react-dom';
import App from "@/entrypoints/popup/App.tsx";

export default defineContentScript({
    matches:['*://www.linkedin.com/messaging*'],
   main()  {
       chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
           if (message.action === 'insertMessage') {
               // Find the LinkedIn message input field
               const messageDiv = document.body.querySelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate');

               if (messageDiv) {
                   const pTag = messageDiv.querySelector('p');
                   const ariaLabel = messageDiv.nextElementSibling
                   ariaLabel?.classList.remove('msg-form__placeholder');
                   console.log('ariaLabel:', ariaLabel);
                   // const ariaLabel = outerDiv?.querySelector('.msg-form__placeholder .t-14 .t-black--light .t-normal')
                   // ariaLabel?.classList.remove('msg-form__placeholder');
                   messageDiv.removeAttribute('aria-placeholder'); // Remove the placeholder
                   messageDiv.removeAttribute('aria-label'); // Remove the placeholder
                   if (pTag) {
                       pTag.removeAttribute('aria-placeholder'); // Remove the placeholder
                       pTag.removeAttribute('aria-label'); // Remove the placeholder
                       pTag.innerHTML = message.content; // Insert the message content
                       // console.log('Message inserted:', message.content);

                       // Update aria-label
                       // messageDiv.setAttribute('aria-label', '');

                       // Enable the send button
                       // const sendButton = document.querySelector('.msg-form__send-button.artdeco-button.artdeco-button--1');
                       // if (sendButton) {
                       //     sendButton.removeAttribute('disabled'); // Enable the button
                       // }

                       // Set the data attribute to indicate focus
                       // messageDiv.setAttribute('data-artdeco-is-focused', 'true');

                       sendResponse({ status: 'success' });
                   } else {
                       console.error('Message <p> tag not found!');
                       sendResponse({ status: 'error', message: 'Message <p> tag not found!' });
                   }
               } else {
                   console.error('Message input field not found!');
                   sendResponse({ status: 'error', message: 'Message input field not found!' });
               }
           }
       });

       const extensionDiv = document.createElement('div');
       extensionDiv.id = 'ai-response-generator-root';
       document.body.appendChild(extensionDiv);

       // Add styles to position the icon at the bottom of the page
       const styleElement = document.createElement('style');
       styleElement.innerHTML = `
        #ai-response-generator-root {
            position: fixed;
            bottom: 10%;
            left: 10px;
            z-index: 1000;
             width: 50px;
            height: 50px;
        }
        #ai-response-generator-root img {
            width: 50px;
            height: 50px;
            cursor: pointer;
        }
    `;
       document.head.appendChild(styleElement);

       ReactDOM.render(
           React.createElement(App),
           document.getElementById('ai-response-generator-root')
       );
   }
});