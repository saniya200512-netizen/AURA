def generate_report(detections, risk):
    people = risk["people_count"]
    vehicles = risk["vehicle_count"]
    score = risk["risk_score"]
    level = risk["risk_level"]

    if level == "CRITICAL":
        action = "Immediate emergency response recommended."
    elif level == "HIGH":
        action = "High-priority monitoring recommended."
    elif level == "MEDIUM":
        action = "Continue monitoring the area."
    else:
        action = "No immediate action required."

    report = {
        "title": "AURA INCIDENT REPORT",
        "scene_summary": f"{people} people and {vehicles} vehicles detected.",
        "risk_assessment": {
            "score": score,
            "level": level
        },
        "key_factors": risk["reasons"],
        "recommended_action": action
    }

    return report
