def calculate_risk(analysis):

    people_count = analysis.get("people_count", 0)
    vehicle_count = analysis.get("vehicle_count", 0)

    score = 0
    reasons = []

    # Multiple people
    if people_count >= 3:
        score += 20
        reasons.append("Multiple people detected")

    # Vehicles
    if vehicle_count >= 1:
        score += 15
        reasons.append("Vehicle detected")

    # People + vehicles
    if people_count > 0 and vehicle_count > 0:
        score += 10
        reasons.append(
            "People and vehicles detected in the same scene"
        )

    # High crowd
    if people_count >= 6:
        score += 20
        reasons.append("High number of people detected")

    # Keep score within 100
    score = min(score, 100)

    # Risk level
    if score >= 60:
        risk_level = "HIGH"
    elif score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons
    }