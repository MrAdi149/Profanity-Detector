**Profanity Detection System with Chrome Extension**

**Overview**

This project features a Profanity Detection System developed using Flask and Python, along with a corresponding Chrome Extension for real-time text analysis. The system allows users to check selected text for profanity and offers advanced filtering capabilities, including leet speak translations.

**Key Features**

Flask Backend: Utilizes Flask framework to create a RESTful API for profanity analysis.

Efficient Caching: Implements a caching mechanism to optimize the retrieval of profanity lists.

Advanced Profanity Checks: Incorporates leet speak translations for enhanced content filtering.

CORS Support: Ensures cross-origin resource sharing compatibility for seamless integration with web applications.

Chrome Extension Integration: Integrates the backend system with a Chrome extension, enabling real-time text analysis.

Asynchronous Communication: Utilizes asynchronous communication between the extension, content script, and background script for efficient processing.

**Usage**

Clone the repository: git clone https://github.com/MrAdi149/profanity-detection.git

Install dependencies: pip install -r requirements.txt

Run Flask app: python app.py

Load the Chrome Extension by navigating to chrome://extensions/ and selecting "Load unpacked."

**Demonstration:**

**Contributing**

Contributions are welcome! Feel free to open issues and submit pull requests.

