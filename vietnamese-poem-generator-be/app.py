from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

model_list = ['dumb', 'trans', 'transpre', 'cnnlstm']

@app.route('/')
def home():
    return jsonify({"message": "system is working"}), 200

try:
    poem_generator = pipeline("text-generation", model="votaquangnhat/vietnamese-poem-hustgpt2-lucbat")
except Exception as e:
    print(f"Error loading the model: {e}")
    poem_generator = None

@app.route("/test")
def test():
    if not poem_generator:
        return jsonify({"error": "Model could not be loaded."}), 500

    prompt = "con tim"

    if not prompt:
        return jsonify({"error": "Prompt is required."}), 400

    try:
        result = poem_generator(prompt, max_length=200, truncation=True)
        poem = result[0]['generated_text']
        return jsonify({"poem": poem}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate_poem", methods=["POST"])
def generate_poem():
    if not poem_generator:
        return jsonify({"error": "Model could not be loaded."}), 500

    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "Prompt is required."}), 400

    try:
        result = poem_generator(prompt, max_length=100, truncation=True)
        poem = result[0]['generated_text']
        return jsonify({"poem": poem}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)