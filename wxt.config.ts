import {defineConfig} from 'wxt';

export default defineConfig({
    manifest: {
        manifest_version: 3,
        name: "LinkedIn AI Response Generator",
        description: "Generates AI responses using OpenAI for LinkedIn messages.",
        version: "1.0",
        permissions: ["activeTab", "tabs", "storage", "scripting"],
        background: {
            service_worker: "src/background.js",
        },
        action: {
            default_popup: "src/pages/popup.html",
        },
        content_scripts: [
            {
                matches: ["*://www.linkedin.com/*"],
                js: ["content-scripts/content.js"],
                css: ['assets/popup-wwYWVWPp.css'],
            },
        ],
        content_security_policy: {
            extension_pages: "script-src 'self'; object-src 'self';"
        }
    }
});
