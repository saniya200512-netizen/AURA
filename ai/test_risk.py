from risk_engine import calculate_risk

detections = [
    {"object": "person", "confidence": 0.91},
    {"object": "car", "confidence": 0.88}
]

result = calculate_risk(detections)

print(result)
