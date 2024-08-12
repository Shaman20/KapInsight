# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from analyzer import analyze_website, save_results_to_file

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/analyze', methods=['POST'])
@cross_origin('http://localhost:3000')
def analyze_website_api():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    try:
        results = analyze_website(url)
        save_results_to_file(url, results)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
