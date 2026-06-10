import requests
import base64
import json
import sys

API_KEY = "AIzaSyB8hT5NWcSQE-ORBXhaZ1cDzRtrrXpOzpg"

prompt = (
    "Food photography of Korean-Chinese braised eggplant dish in soy sauce. "
    "Soft eggplant pieces with dark glossy sauce, garnished with green onions and sesame seeds. "
    "Overhead angle, white ceramic plate, warm restaurant lighting, appetizing and vibrant."
)

url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key={API_KEY}"

payload = {
    "instances": [{"prompt": prompt}],
    "parameters": {"sampleCount": 1}
}

response = requests.post(url, json=payload)
print(f"Status: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    image_b64 = data["predictions"][0]["bytesBase64Encoded"]
    image_bytes = base64.b64decode(image_b64)
    out = "/Users/seongoyoon/Desktop/claude code/1일차/1일차 혼자/탕수육 반찬/thumbnail.png"
    with open(out, "wb") as f:
        f.write(image_bytes)
    print(f"Saved: {out}")
else:
    print(f"Error: {response.text}")
    sys.exit(1)
