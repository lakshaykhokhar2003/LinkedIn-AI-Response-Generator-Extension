export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message, _, __) => {
    if (message.action === 'insertMessage') {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          await chrome.tabs.sendMessage(tabs[0].id, { action: 'insertMessage', content: message.content });
        }
      });
    }
  });

});
