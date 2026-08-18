from ultralytics import YOLO


# Load the YOLO model
model = YOLO("yolo11n.pt")


def detect_objects(image_path):
    results = model(image_path)

    detections = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            object_name = model.names[class_id]

            detections.append({
                "object": object_name,
                "confidence": round(confidence, 3)
            })

    return {
        "status": "success",
        "detections": detections
    }