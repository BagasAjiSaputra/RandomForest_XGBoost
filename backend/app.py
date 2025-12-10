from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pickle
import json
import os
import warnings

warnings.filterwarnings("ignore")

# INIT APP
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# LOAD MODELS
random_forest_model = joblib.load(
    os.path.join(BASE_DIR, "models/random_forest.pkl")
)

xgboost_model = joblib.load(
    os.path.join(BASE_DIR, "models/xgboost.pkl")
)

# LOAD ENCODERS
with open(os.path.join(BASE_DIR, "models/encoders.pkl"), "rb") as f:
    encoder_data = pickle.load(f)

ENCODERS = encoder_data["encoders"]
FEATURE_COLUMNS = encoder_data["columns"]

# LOAD ACCURACY JSON
RF_EVAL_PATH = os.path.join(BASE_DIR, "forest.json")
XGB_EVAL_PATH = os.path.join(BASE_DIR, "xgboost.json")

# HELPER FUNCTIONS
def load_accuracy(path):
    with open(path, "r") as f:
        data = json.load(f)
    return data.get("accuracy")


def encode_features(input_data: dict):

    # Encode Fitur
    fitur_tersusun = []

    for col in FEATURE_COLUMNS:
        value = input_data.get(col)

        if value is None:
            raise ValueError(f"Feature '{col}' wajib diisi")

        if col in ENCODERS:
            value = ENCODERS[col].transform([value])[0]

        fitur_tersusun.append(value)

    return np.array(fitur_tersusun).reshape(1, -1)


# ROUTES
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "ok",
        "message": "Stroke Prediction API running"
    })


# RANDOM FOREST PREDICT
@app.route("/predict", methods=["POST"])
def predict_random_forest():
    try:
        data = request.get_json()
        encoded = encode_features(data)
        hasil = int(random_forest_model.predict(encoded)[0])

        return jsonify({
            "status": True,
            "model": "random_forest",
            "hasil_prediksi": hasil
        })

    except Exception as e:
        return jsonify({
            "status": False,
            "message": str(e)
        }), 500


# XGBOOST PREDICT
@app.route("/xgboost", methods=["POST"])
def predict_xgboost():
    try:
        data = request.get_json()
        encoded = encode_features(data)
        hasil = int(xgboost_model.predict(encoded)[0])

        return jsonify({
            "status": True,
            "model": "xgboost",
            "hasil_prediksi": hasil
        })

    except Exception as e:
        return jsonify({
            "status": False,
            "message": str(e)
        }), 500


# ACCURACY RANDOM FOREST
@app.route("/accuracy/random-forest", methods=["GET"])
def accuracy_random_forest():
    try:
        accuracy = load_accuracy(RF_EVAL_PATH)
        return jsonify({
            "status": True,
            "model": "random_forest",
            "accuracy": accuracy
        })

    except Exception as e:
        return jsonify({
            "status": False,
            "message": str(e)
        }), 500

# ACCURACY XGBOOST
@app.route("/accuracy/xgboost", methods=["GET"])
def accuracy_xgboost():
    try:
        accuracy = load_accuracy(XGB_EVAL_PATH)
        return jsonify({
            "status": True,
            "model": "xgboost",
            "accuracy": accuracy
        })

    except Exception as e:
        return jsonify({
            "status": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
