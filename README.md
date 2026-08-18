\# AURA – AI Urban Risk System



AURA is an AI-powered urban risk analysis system designed to detect people, vehicles, and potential risk factors from images and generate an intelligent risk assessment.



\## 🚀 Features



\- AI-based object detection using YOLO

\- Detects people and vehicles

\- Automated urban risk scoring

\- Risk classification: Low, Medium, High

\- AI-generated risk reasons

\- FastAPI backend

\- React + Vite frontend

\- Incident analysis API

\- Local incident database



\## 🧠 How It Works



1\. User uploads an image.

2\. AURA processes the image using YOLO.

3\. Objects such as people and vehicles are detected.

4\. The risk engine analyzes the detected objects.

5\. AURA calculates a risk score.

6\. The system returns the risk level and explanation.



\## 🛠️ Tech Stack



\### Frontend

\- React

\- Vite

\- HTML

\- CSS

\- JavaScript



\### Backend

\- Python

\- FastAPI

\- Uvicorn



\### AI

\- YOLO

\- Ultralytics

\- Computer Vision



\### Database

\- SQLite



\## 📁 Project Structure



```text

AURA/

│

├── ai/

│   ├── aura\_analysis.py

│   ├── database.py

│   ├── report\_engine.py

│   ├── risk\_engine.py

│   └── vision.py

│

├── backend/

│   ├── main.py

│   └── ai/

│       └── vision.py

│

├── frontend/

│   ├── src/

│   ├── public/

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

└── README.md

