import sys
import torch
import requests
from PIL import Image
from transformers import AutoModelForCausalLM, AutoProcessor

# Load model and processor
model_id_or_path = "rhymes-ai/Aria"
model = AutoModelForCausalLM.from_pretrained(model_id_or_path, device_map="auto", torch_dtype=torch.bfloat16, trust_remote_code=True)
processor = AutoProcessor.from_pretrained(model_id_or_path, trust_remote_code=True)

def analyze_image(image_path):
    # Open the image
    image = Image.open(requests.get(image_path, stream=True).raw)

    messages = [
        {
            "role": "user",
            "content": [
                {"text": None, "type": "image"},
                {"text": "what is the image?", "type": "text"},
            ],
        }
    ]

    text = processor.apply_chat_template(messages, add_generation_prompt=True)
    inputs = processor(text=text, images=image, return_tensors="pt")
    inputs["pixel_values"] = inputs["pixel_values"].to(model.dtype)
    inputs = {k: v.to(model.device) for k, v in inputs.items()}

    with torch.inference_mode(), torch.cuda.amp.autocast(dtype=torch.bfloat16):
        output = model.generate(
            **inputs,
            max_new_tokens=500,
            stop_strings=["<|im_end|>"],
            tokenizer=processor.tokenizer,
            do_sample=True,
            temperature=0.9,
        )
        output_ids = output[0][inputs["input_ids"].shape[1]:]
        result = processor.decode(output_ids, skip_special_tokens=True)

    return result

if __name__ == "__main__":
    image_url = sys.argv[1]  # Get image URL from command line argument
    result = analyze_image(image_url)
    print(result)
