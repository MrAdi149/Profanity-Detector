function checkSelectedTextForProfanity() {
    let selectedText = window.getSelection().toString();
    if (selectedText) {
        // Send the selected text to the background script for checking
        chrome.runtime.sendMessage({ action: "checkText", text: selectedText }, (response) => {
            // Handle the response from the background script
            if (response && response.profanityFound) {
                alert("Profanity found in the text!");
            } else {
                alert("No profanity found.");
            }
        });
    } else {
        alert("No text is selected.");
    }
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkProfanity") {
        checkSelectedTextForProfanity();
    }
    return true; // Always return true to ensure asynchronous use of `sendResponse`
});
