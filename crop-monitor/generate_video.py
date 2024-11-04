# generate_video.py

import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()
ALLEGRO_API_KEY = os.getenv("ALLEGRO_API_KEY")

def generate_video(refined_prompt):
    url = "https://api.rhymes.ai/v1/generateVideoSyn"
    headers = {"Authorization": f"Bearer {ALLEGRO_API_KEY}", "Content-Type": "application/json"}
    data = {"refined_prompt": refined_prompt, "num_step": 100, "cfg_scale": 7.5, "user_prompt": refined_prompt, "rand_seed": 12345}

    response = requests.post(url, headers=headers, json=data).json()
    if response.get("status") == 0:
        return poll_video_task(response["data"])
    else:
        return "Failed to start video generation: " + response.get("message", "Unknown error")

def poll_video_task(request_id, interval=120):
    url = "https://api.rhymes.ai/v1/videoQuery"
    headers = {"Authorization": f"Bearer {ALLEGRO_API_KEY}"}

    while True:
        response = requests.get(url, headers=headers, params={"requestId": request_id}).json()
        if response.get("status") == 0 and "data" in response:
            return f"Video URL: {response['data']}"
        elif response.get("status") != 0:
            return "Video generation failed."
        time.sleep(interval)

if __name__ == "__main__":
    import sys
    refined_prompt = sys.argv[1] if len(sys.argv) > 1 else "Default prompt"
    print(generate_video(refined_prompt))
