from report_engine import generate_report

risk = {
    "risk_score": 43,
    "risk_level": "MEDIUM",
    "people_count": 4,
    "vehicle_count": 1,
    "reasons": [
        "Multiple people detected",
        "Vehicle detected",
        "People and vehicles detected in the same scene"
    ]
}

report = generate_report([], risk)

print("\n========== AURA INCIDENT REPORT ==========")
print("Scene Summary:", report["scene_summary"])
print("Risk Score:", report["risk_assessment"]["score"])
print("Risk Level:", report["risk_assessment"]["level"])

print("\nKey Factors:")
for factor in report["key_factors"]:
    print("-", factor)

print("\nRecommended Action:")
print(report["recommended_action"])

print("==========================================")
