// Listen for messages from the extension popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the received message is for checking text for profanity
    if (request.action === "checkText") {
        // Make a POST request to the Flask API endpoint for profanity check
        fetch('http://localhost:5000/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Send the selected text from the content script in the request body
            body: JSON.stringify({ text: request.text })
        })
        // Process the response from the Flask API
        .then(response => response.json())
        .then(data => {
            // Send a response back to the content script with the profanity check result
            sendResponse({ profanityFound: data.result === "Profanity detected!" });
        })
        .catch(error => {
            // Handle errors during the profanity check request
            // You could also choose to send an error message to the frontend
            console.error('Error when checking for profanity:', error);
            sendResponse({ error: 'There was an error checking for profanity.' });
        });
        return true; // Indicate asynchronous response
    }
});

// Listen for the extension being installed or updated
chrome.runtime.onInstalled.addListener(() => {
    // Create a context menu item for checking text for profanity when selected
    chrome.contextMenus.create({
        id: "checkProfanity",
        title: "Check Text for Profanity",
        contexts: ["selection"]
    });
});

// Listen for clicks on context menu items
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // Check if the clicked menu item is the one for checking text for profanity
    if (info.menuItemId === "checkProfanity") {
        // Execute a content script to check the selected text for profanity
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: checkSelectedTextForProfanity
        });
    }
});

// Function to check the currently selected text for profanity
function checkSelectedTextForProfanity() {
    // Get the selected text from the active tab
    const selectedText = window.getSelection().toString();
    // Check if there is selected text
    if (selectedText) {
        // Send a message to the background script to check the selected text for profanity
        chrome.runtime.sendMessage({ action: "checkText", text: selectedText });
    }
}
