
from flask import Flask, request, jsonify
import requests
import re
from cachetools import cached, TTLCache
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)

cache = TTLCache(maxsize=100, ttl=7200)

@cached(cache)
def download_profanity_list(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        bad_words = set(response.text.splitlines())
        return bad_words
    except requests.RequestException as e:
        print(f"Error downloading profanity list: {e}")
        return set()  # Return an empty set if there's an error

def contains_profanity(text, bad_words_list):
    text_words = re.findall(r'\b\w+\b', text.lower())
    return any(word in bad_words_list for word in text_words)

def enhanced_profanity_check(text, bad_words_list):
    leet_speak_translations = {
        '1': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '0': 'o',
        '7': 't', '8': 'b', '+': 't', '(': 'c'
    }
    leet_pattern = re.compile('|'.join(map(re.escape, leet_speak_translations)))
    
    def leet_translate(match):
        return leet_speak_translations[match.group(0)]
    
    translated_text = leet_pattern.sub(leet_translate, text.lower())
    return contains_profanity(translated_text, bad_words_list)

@app.route('/check', methods=['POST'])
def check():
    try:
        content = request.json
        text_to_check = content['text']
    except (TypeError, KeyError):
        return jsonify(result="Invalid input data")

    url = "https://www.cs.cmu.edu/~biglou/resources/bad-words.txt"
    bad_words_list = download_profanity_list(url)

    if enhanced_profanity_check(text_to_check, bad_words_list):
        result = "Profanity detected!"
    else:
        result = "No profanity detected."
    
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)


