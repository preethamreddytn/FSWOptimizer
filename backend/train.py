import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
import joblib
import os

def generate_fsw_data(samples=1000):
    np.random.seed(42)
    
    rpm = np.random.uniform(400, 1600, samples)
    speed = np.random.uniform(20, 100, samples)
    force = np.random.uniform(5, 15, samples)
    shoulder = np.random.uniform(15, 25, samples)
    pin = np.random.uniform(4, 10, samples)
    
    rpm_effect = -0.0002 * (rpm - 1050)**2 + 100
    speed_effect = -0.5 * (speed - 60)**2 + 30
    force_effect = 5 * force
    shoulder_effect = 2 * shoulder
    
    tensile = 100 + rpm_effect + speed_effect + force_effect + shoulder_effect
    tensile += np.random.normal(0, 5, samples) 
    
    efficiency = (tensile / 350.0) * 100
    efficiency += np.random.normal(0, 2, samples)
    efficiency = np.clip(efficiency, 30, 98)
    
    data = pd.DataFrame({
        'rotational_speed': rpm,
        'welding_speed': speed,
        'axial_force': force,
        'shoulder_diameter': shoulder,
        'pin_diameter': pin,
        'tensile_strength': tensile,
        'efficiency': efficiency
    })
    
    return data

def train_models():
    print("Generating synthetic FSW dataset...")
    df = generate_fsw_data(1000)
    
    X = df[['rotational_speed', 'welding_speed', 'axial_force', 'shoulder_diameter', 'pin_diameter']]
    y_tensile = df['tensile_strength']
    y_efficiency = df['efficiency']
    
    X_train, X_test, yt_train, yt_test, ye_train, ye_test = train_test_split(
        X, y_tensile, y_efficiency, test_size=0.2, random_state=42
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(scaler, 'models/scaler.pkl')
    
    models = {
        'ann': MLPRegressor(hidden_layer_sizes=(64, 32, 16), max_iter=1000, random_state=42),
        'random_forest': RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42),
        'decision_tree': DecisionTreeRegressor(max_depth=8, random_state=42),
        'linear_regression': Ridge(alpha=1.0)
    }
    
    results = {}
    
    for name, model_t in models.items():
        print(f"Training {name} for Tensile Strength...")
        model_t.fit(X_train_scaled, yt_train)
        pred_t = model_t.predict(X_test_scaled)
        r2_t = r2_score(yt_test, pred_t)
        
        joblib.dump(model_t, f'models/{name}_tensile.pkl')
        
        print(f"Training {name} for Efficiency...")
        
        if name == 'ann': model_e = MLPRegressor(hidden_layer_sizes=(64, 32, 16), max_iter=1000, random_state=42)
        elif name == 'random_forest': model_e = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)
        elif name == 'decision_tree': model_e = DecisionTreeRegressor(max_depth=8, random_state=42)
        else: model_e = Ridge(alpha=1.0)
            
        model_e.fit(X_train_scaled, ye_train)
        pred_e = model_e.predict(X_test_scaled)
        r2_e = r2_score(ye_test, pred_e)
        
        joblib.dump(model_e, f'models/{name}_efficiency.pkl')
        
        results[name] = {'R2_Tensile': r2_t, 'R2_Efficiency': r2_e}
        print(f"✓ {name} - Tensile R2: {r2_t:.4f}, Efficiency R2: {r2_e:.4f}")
    
    print("\nModel training complete! Artifacts saved in 'models/' directory.")

if __name__ == "__main__":
    train_models()
