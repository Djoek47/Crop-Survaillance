# ask_aria.py

import os
import requests
from dotenv import load_dotenv

load_dotenv()
ARIA_API_KEY = os.getenv("ARIA_API_KEY")

def ask_aria(user_message):
    try:
        response = requests.post(
            'https://api.rhymes.ai/v1/chat/completions',
            headers={'Authorization': f'Bearer {ARIA_API_KEY}', 'Content-Type': 'application/json'},
            json={"model": "aria", "messages": [{"role": "user", "content": user_message}], "temperature": 0.6}
        )
        return response.json()['choices'][0]['message']['content'] if response.status_code == 200 else f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"An error occurred: {e}"

if __name__ == "__main__":
    import sys
    user_message = sys.argv[1] if len(sys.argv) > 1 else "Hello, Aria!"
    print(ask_aria(user_message))
