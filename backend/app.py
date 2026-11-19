from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import joblib
import numpy as np
import os
import traceback
import sqlite3
import hashlib
from functools import wraps

app = Flask(__name__)
CORS(app)

MODELS = ['ann', 'random_forest', 'decision_tree', 'linear_regression']

# Global dictionaries to cache the loaded models & scaler
models_cache = {'tensile': {}, 'efficiency': {}}
scaler = None

def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def load_models():
    global scaler
    try:
        if os.path.exists('models/scaler.pkl'):
            scaler = joblib.load('models/scaler.pkl')
            for m in MODELS:
                t_path = f'models/{m}_tensile.pkl'
                e_path = f'models/{m}_efficiency.pkl'
                if os.path.exists(t_path):
                    models_cache['tensile'][m] = joblib.load(t_path)
                if os.path.exists(e_path):
                    models_cache['efficiency'][m] = joblib.load(e_path)
            print("Successfully loaded pre-trained models")
        else:
            print("Warning: Models not found. Run train.py first.")
    except Exception as e:
        print(f"Error loading models: {e}")

load_models()

@app.route("/", methods=["GET"])
def home():
    
    return redirect("/api/signup")

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password or len(password) < 6:
        return jsonify({'error': 'Please provide name, email, and a password (min 6 chars)'}), 400
        
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, hash_password(password)))
        conn.commit()
        user_id = c.lastrowid
        conn.close()
        return jsonify({'message': 'User registered successfully', 'user': {'id': user_id, 'name': name, 'email': email}})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already registered'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
        
    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute('SELECT id, name, email FROM users WHERE email=? AND password=?', (email, hash_password(password)))
        user = c.fetchone()
        conn.close()
        
        if user:
            return jsonify({'message': 'Login successful', 'user': {'id': user[0], 'name': user[1], 'email': user[2], 'token': 'dummy-jwt-token'}})
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract numerical features in order expected by scaler
        # order: rotational_speed, welding_speed, axial_force, shoulder_diameter, pin_diameter
        features = np.array([[
            float(data.get('rotational_speed', 800)),
            float(data.get('welding_speed', 60)),
            float(data.get('axial_force', 10)),
            float(data.get('shoulder_diameter', 18)),
            float(data.get('pin_diameter', 6))
        ]])
        
        # If no models are trained, return deterministic fallback 
        if not scaler or not models_cache['tensile']:
            return jsonify({'error': 'Models not trained on server yet.'}), 503
            
        scaled_features = scaler.transform(features)
        
        predictions = {}
        for m in MODELS:
            if m in models_cache['tensile'] and m in models_cache['efficiency']:
                tensile = models_cache['tensile'][m].predict(scaled_features)[0]
                eff = models_cache['efficiency'][m].predict(scaled_features)[0]
                predictions[m] = {
                    'tensile_strength': max(round(float(tensile), 2),0),
                    'efficiency': max(round(float(eff), 2),0)
                }
        
        # Find the mathematical best model based on maximum tensile strength
        if predictions:
            best_model = max(predictions.keys(), key=lambda k: predictions[k]['tensile_strength'])
        else:
            best_model = 'ann'

        # Basic confidence heuristic based on model type
        confidences = {'ann': 98.2, 'random_forest': 96.7, 'decision_tree': 92.4, 'linear_regression': 84.1}
        confidence = confidences.get(best_model, 95.0)

        return jsonify({
            'predictions': predictions,
            'best_model': best_model,
            'confidence': confidence
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'models_loaded': scaler is not None})

if __name__ == '__main__':
    # Run server
    app.run(host='0.0.0.0', port=5000, debug=True)
