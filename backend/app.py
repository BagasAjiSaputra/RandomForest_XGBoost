from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json
import os
import warnings

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# LOAD MODEL
random_forest_model = joblib.load(
    os.path.join(BASE_DIR, "models/random_forest.pkl")
)

xgboost_model = joblib.load(
    os.path.join(BASE_DIR, "models/xgboost.pkl")
)

# LOAD JSON
RF_EVAL_PATH = os.path.join(
    BASE_DIR, "forest.json"
)

XGB_EVAL_PATH = os.path.join(
    BASE_DIR, "xgboost.json"
)

# HELPER AKURASI
def load_accuracy(path):
    with open(path, "r") as f:
        data = json.load(f)
    return data.get("accuracy")



# ENCODER HELPER
def encode_features(fitur):
    gender_map = {"Male": 1, "Female": 0}
    married_map = {"Yes": 1, "No": 0}
    work_map = {"Private": 0, "Self-employed": 1, "Govt_job": 2}
    residence_map = {"Urban": 1, "Rural": 0}
    smoking_map = {
        "never smoked": 0,
        "formerly smoked": 1,
        "smokes": 2
    }

    return [
        gender_map[fitur[0]],
        fitur[1],
        fitur[2],
        fitur[3],
        married_map[fitur[4]],
        work_map[fitur[5]],
        residence_map[fitur[6]],
        fitur[7],
        fitur[8],
        smoking_map[fitur[9]]
    ]


# RANDOM FOREST
@app.route("/predict", methods=["POST"])
def predict_random_forest():
    data = request.get_json()
    fitur = data.get("fitur")

    try:
        encoded = encode_features(fitur)
        hasil = int(random_forest_model.predict([encoded])[0])

        return jsonify({
            "status": True,
            "model": "random_forest",
            "hasil_prediksi": hasil,
            "input": fitur
        })

    except Exception as e:
        return jsonify({
            "status": False,
            "message": str(e)
        }), 500


# XGBOOST
@app.route("/xgboost", methods=["POST"])
def predict_xgboost():
    data = request.get_json()
    fitur = data.get("fitur")

    try:
        encoded = encode_features(fitur)
        hasil = int(xgboost_model.predict([encoded])[0])

        return jsonify({
            "status": True,
            "model": "xgboost",
            "hasil_prediksi": hasil,
            "input": fitur
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
    

# HEALTH CHECK
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "ok",
        "message": "Stroke Prediction API running"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
