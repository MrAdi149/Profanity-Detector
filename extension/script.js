// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the 'checkButton' element in the DOM
    const checkButton = document.getElementById('checkButton');

    // Attach a click event listener to the 'checkButton'
    checkButton.addEventListener('click', function () {
        // Query for information about the currently active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            // Handle errors that may occur during tab query
            if (chrome.runtime.lastError) {
                console.error('Error querying the tabs:', chrome.runtime.lastError.message);
                return;
            }

            // Check if any tabs are active
            if (tabs.length === 0) {
                console.error('No active tabs found.');
                return;
            }

            // Get the ID of the current active tab
            const currentTabId = tabs[0].id;

            // Check if the current tab ID is defined
            if (currentTabId !== undefined) {
                // Execute a content script on the current tab to get the selected text
                chrome.scripting.executeScript({
                    target: { tabId: currentTabId },
                    func: getSelectedText
                }, (results) => {
                    // Handle errors that may occur during script execution
                    if (chrome.runtime.lastError) {
                        console.error('Error executing script:', chrome.runtime.lastError.message);
                        return;
                    }

                    // Check if there are results from the script execution
                    if (results && results.length > 0 && results[0].result) {
                        // Extract the selected text from the script execution results
                        const selectedText = results[0].result;

                        // Send a message to the background script to check for profanity in the selected text
                        chrome.runtime.sendMessage({ action: "checkText", text: selectedText }, (response) => {
                            // Handle errors that may occur during message sending
                            if (chrome.runtime.lastError) {
                                console.error('Error sending message:', chrome.runtime.lastError.message);
                                return;
                            }

                            // Check the response from the background script for profanity detection
                            if (response && response.profanityFound) {
                                // Display an alert if profanity is found
                                alert("Profanity found in the text!");
                            } else {
                                // Display an alert if no profanity is found
                                alert("No profanity found.");
                            }
                        });
                    } else {
                        // Log an error if no text was selected or no results returned from script execution
                        console.error('No text was selected or no results returned from script execution.');
                    }
                });
            } else {
                // Log an error if the current tab is not defined or has no ID
                console.error('The current tab is not defined or has no id.');
            }
        });
    });
});

// Function to get the currently selected text in the active tab
function getSelectedText() {
    return window.getSelection().toString();
}
