import sqlite3
from datetime import datetime

DATABASE = "aura.db"


def initialize_database():
    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            people_count INTEGER NOT NULL,
            vehicle_count INTEGER NOT NULL,
            reasons TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def save_incident(risk):
    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO incidents (
            timestamp,
            risk_score,
            risk_level,
            people_count,
            vehicle_count,
            reasons
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().isoformat(),
        risk["risk_score"],
        risk["risk_level"],
        risk["people_count"],
        risk["vehicle_count"],
        " | ".join(risk["reasons"])
    ))

    connection.commit()
    connection.close()


def get_incidents():
    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            id,
            timestamp,
            risk_score,
            risk_level,
            people_count,
            vehicle_count,
            reasons
        FROM incidents
        ORDER BY id DESC
    """)

    incidents = cursor.fetchall()

    connection.close()

    return incidents


initialize_database()
