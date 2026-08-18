from ultralytics import YOLO
import os


# ---------------------------------------------------------
# YOLO MODEL
# ---------------------------------------------------------

MODEL_PATH = "yolov8n.pt"

model = YOLO(MODEL_PATH)


# ---------------------------------------------------------
# RISK CALCULATION
# ---------------------------------------------------------

def calculate_risk(detections, image_width):
    """
    Calculate urban safety risk based on detected objects.

    detections = list of detected object names
    image_width = width of analyzed image
    """

    risk_score = 0
    reasons = []

    # Count important objects
    person_count = detections.count("person")

    vehicle_classes = [
        "car",
        "bus",
        "truck",
        "motorcycle",
        "bicycle",
        "train"
    ]

    vehicle_count = sum(
        detections.count(vehicle)
        for vehicle in vehicle_classes
    )

    # -----------------------------------------------------
    # PEOPLE
    # -----------------------------------------------------

    if person_count >= 5:
        risk_score += 25
        reasons.append("High number of people detected")

    elif person_count >= 3:
        risk_score += 15
        reasons.append("Multiple people detected")

    elif person_count >= 1:
        risk_score += 5


    # -----------------------------------------------------
    # VEHICLES
    # -----------------------------------------------------

    if vehicle_count >= 3:
        risk_score += 30
        reasons.append("Multiple vehicles detected")

    elif vehicle_count >= 1:
        risk_score += 15
        reasons.append("Vehicle detected")


    # -----------------------------------------------------
    # PEOPLE + VEHICLES
    # -----------------------------------------------------

    if person_count > 0 and vehicle_count > 0:
        risk_score += 10
        reasons.append("People and vehicles detected together")


    # -----------------------------------------------------
    # LIMIT SCORE
    # -----------------------------------------------------

    risk_score = min(risk_score, 100)


    # -----------------------------------------------------
    # RISK LEVEL
    # -----------------------------------------------------

    if risk_score >= 70:
        risk_level = "HIGH"

    elif risk_score >= 40:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"


    return {
        "score": risk_score,
        "level": risk_level,
        "reasons": reasons
    }


# ---------------------------------------------------------
# IMAGE ANALYSIS
# ---------------------------------------------------------

def analyze_image(image_path):
    """
    Analyze an image using YOLO and calculate urban risk.
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )


    # Run YOLO
    results = model(image_path)


    # -----------------------------------------------------
    # DETECTIONS
    # -----------------------------------------------------

    detections = []

    for result in results:

        if result.boxes is None:
            continue

        for box in result.boxes:

            class_id = int(box.cls[0])

            class_name = model.names[class_id]

            confidence = float(box.conf[0])

            detections.append({
                "object": class_name,
                "confidence": round(confidence, 3)
            })


    # -----------------------------------------------------
    # SIMPLE OBJECT LIST
    # -----------------------------------------------------

    object_names = [
        detection["object"]
        for detection in detections
    ]


    # -----------------------------------------------------
    # IMAGE WIDTH
    # -----------------------------------------------------

    image_width = 0

    if results and results[0].orig_shape:
        image_width = results[0].orig_shape[1]


    # -----------------------------------------------------
    # CALCULATE RISK
    # -----------------------------------------------------

    risk = calculate_risk(
        object_names,
        image_width
    )


    # -----------------------------------------------------
    # FINAL RESPONSE
    # -----------------------------------------------------

    return {
        "detections": detections,

        "objects_detected": object_names,

        "total_objects": len(detections),

        "risk_score": risk["score"],

        "risk_level": risk["level"],

        "reasons": risk["reasons"]
    }
