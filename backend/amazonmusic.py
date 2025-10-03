import os
import json
from flask import Flask, request, jsonify
from amazonmusic import AmazonMusic

app = Flask(__name__)
am = None  # Globales AmazonMusic-Objekt

CREDENTIALS_FILE = os.path.expanduser("~/.decky_amazon_credentials.json")

def save_credentials(email, password):
    with open(CREDENTIALS_FILE, "w") as f:
        json.dump({"email": email, "password": password}, f)

def load_credentials():
    if os.path.isfile(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, "r") as f:
            data = json.load(f)
            return data.get("email"), data.get("password")
    return None, None

@app.route("/login", methods=["POST"])
def login():
    global am
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Missing email or password"}), 400

    try:
        # AmazonMusic Objekt initialisieren
        am = AmazonMusic(credentials=lambda: [email, password])
        save_credentials(email, password)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/search", methods=["GET"])
def search():
    global am
    if am is None:
        email, password = load_credentials()
        if not email or not password:
            return jsonify({"success": False, "error": "Not logged in"}), 403
        am = AmazonMusic(credentials=lambda: [email, password])

    query = request.args.get("q", "")
    results = am.search(query, tracks=True, albums=True, playlists=True, artists=False, stations=False)

    # Ergebnisse vereinfachen für Frontend
    simplified = []
    for label, item in results:
        simplified.append({
            "label": label,
            "name": item.get("title") or item.get("name"),
            "id": item.get("asin"),
            "type": label.replace("library_", "").replace("catalog_", "")
        })

    return jsonify({"success": True, "results": simplified})

@app.route("/stream/<track_id>", methods=["GET"])
def get_stream(track_id):
    global am
    if am is None:
        email, password = load_credentials()
        if not email or not password:
            return jsonify({"success": False, "error": "Not logged in"}), 403
        am = AmazonMusic(credentials=lambda: [email, password])

    try:
        # Track suchen und URL zurückgeben
        track = next((t for album in am.albums for t in album.tracks if t.identifier == track_id), None)
        if not track:
            return jsonify({"success": False, "error": "Track not found"}), 404
        return jsonify({"success": True, "stream_url": track.stream_url})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    import sys
    import json

    query = sys.argv[1] if len(sys.argv) > 1 else None

    # Login-Funktion
    am = AmazonMusic(credentials=lambda: [input("Email: "), input("Password: ")])
    results = am.search(query)
    
    print(json.dumps(results))
    app.run(host="0.0.0.0", port=5000)

