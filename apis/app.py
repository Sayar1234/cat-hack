import joblib
import numpy as np
from flask import Flask, request, jsonify

# Initialize the Flask app
app = Flask(__name__)

# --- Load Models on Startup ---
# Load the scaler and the random forest model from the .pkl files
# This is done once when the server starts for efficiency
try:
    scaler = joblib.load('data_scaler.pkl')
    model = joblib.load('user_rating_random_forest_model.pkl')
    print("Models loaded successfully.")
except FileNotFoundError as e:
    print(f"Error loading model files: {e}")
    scaler = None
    model = None

# Define the expected order of features based on the scaler
# The API will expect these exact keys in the JSON input
FEATURE_KEYS = [
    'total_overall_assets_rented', 'total_current_assets', 'distance_per_day',
    'engine_temp_avg', 'coolant_temp_avg', 'oil_pressure_avg',
    'battery_voltage_avg', 'fuel_level_least', 'fuel_consumption_avg',
    'efficiency_avg', 'cycle_counts_per_day', 'env_temp_avg',
    'humidity_avg', 'aqi_avg', 'shock_avg', 'tilt_sensor_avg',
    'overload_per_month'
]

# --- API Endpoint Definition ---
@app.route('/predict', methods=['POST'])
def predict():
    """
    API endpoint to predict user rating based on machine data.
    Expects a JSON payload with keys matching the FEATURE_KEYS list.
    """
    # Ensure models are loaded before processing requests
    if not scaler or not model:
        return jsonify({"error": "Models are not loaded. Check server logs."}), 500

    # Get JSON data from the request
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON input"}), 400

    # --- Input Validation ---
    # Check for missing features and ensure all values are numbers
    try:
        # Create a list of feature values in the correct order
        input_features = [float(data[key]) for key in FEATURE_KEYS]
    except KeyError as e:
        return jsonify({"error": f"Missing feature in request: {e}"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "All feature values must be numbers."}), 400

    try:
        # Convert the list to a NumPy array for the model
        # Reshape to (1, -1) because the scaler expects a 2D array
        final_features = np.array(input_features).reshape(1, -1)

        # --- Scaling and Prediction ---
        # 1. Scale the input features using the loaded scaler
        scaled_features = scaler.transform(final_features)
        
        # 2. Make a prediction using the loaded model
        prediction = model.predict(scaled_features)

        # The model returns a NumPy array, so we extract the first element
        predicted_rating = prediction[0]

        # --- Return the Result ---
        return jsonify({
            "message": "Prediction successful",
            "predicted_user_rating": round(predicted_rating, 2) # Round for a cleaner output
        })

    except Exception as e:
        # Handle any other errors during scaling or prediction
        return jsonify({"error": "Failed to make prediction.", "details": str(e)}), 500

@app.route('/')
def index():
    """A simple index route to show that the API is running."""
    return "<h1>Rating Prediction API</h1><p>Send a POST request to /predict to get a rating.</p>"

if __name__ == '__main__':
    # For local development
    app.run(debug=True)