import { useState, useRef, useEffect } from "react";
import "./App.css";

const API_URL = "";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const [incidents, setIncidents] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // ============================================================
  // DEMO SYSTEM STATUS
  // ============================================================

  const checkBackend = async () => {
    setBackendOnline(true);
  };

  // ============================================================
  // LOAD INCIDENTS
  // ============================================================

  const loadIncidents = async () => {
    // Demo mode
    setIncidents([]);
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    checkBackend();
    loadIncidents();

    const interval = setInterval(() => {
      checkBackend();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ============================================================
  // SELECT IMAGE
  // ============================================================

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  // ============================================================
  // START CAMERA
  // ============================================================

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Camera error:", error);

      alert(
        "Camera access was blocked. Please allow camera permission."
      );
    }
  };

  // ============================================================
  // STOP CAMERA
  // ============================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  // ============================================================
  // CAPTURE CAMERA IMAGE
  // ============================================================

  const captureCameraImage = () => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert("Camera is not ready yet.");
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File(
          [blob],
          "aura-camera-capture.jpg",
          {
            type: "image/jpeg",
          }
        );

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);

        stopCamera();
      },
      "image/jpeg"
    );
  };

  // ============================================================
  // ANALYZE IMAGE - DEMO MODE
  // ============================================================

  const analyzeImage = async () => {
    if (!image) {
      alert("Please upload or capture an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const demoResult = {
        risk_score: 45,

        risk_level: "MEDIUM",

        objects_detected: [
          "person",
          "person",
          "person",
          "person",
          "bus",
        ],

        detections: [
          {
            object: "person",
            confidence: 0.89,
          },
          {
            object: "person",
            confidence: 0.88,
          },
          {
            object: "person",
            confidence: 0.86,
          },
          {
            object: "person",
            confidence: 0.62,
          },
          {
            object: "bus",
            confidence: 0.94,
          },
        ],

        total_objects: 5,

        reasons: [
          "Multiple people detected in the scene.",
          "Vehicle detected in the environment.",
          "People and vehicle interaction requires monitoring.",
        ],
      };

      // --------------------------------------------------------
      // PEOPLE
      // --------------------------------------------------------

      const peopleCount =
        demoResult.objects_detected.filter(
          (object) => object === "person"
        ).length;

      // --------------------------------------------------------
      // VEHICLES
      // --------------------------------------------------------

      const vehicleTypes = [
        "car",
        "bus",
        "truck",
        "motorcycle",
        "bicycle",
        "train",
      ];

      const vehicleCount =
        demoResult.objects_detected.filter(
          (object) =>
            vehicleTypes.includes(object)
        ).length;

      // --------------------------------------------------------
      // DETECTED OBJECTS
      // --------------------------------------------------------

      const detectedObjects =
        demoResult.detections.map((detection) => ({
          name: detection.object,
          confidence: detection.confidence,
        }));

      // --------------------------------------------------------
      // FINAL RESULT
      // --------------------------------------------------------

      const formattedResult = {
        ...demoResult,

        people_count: peopleCount,

        vehicle_count: vehicleCount,

        detected_objects: detectedObjects,

        reasons: demoResult.reasons,
      };

      setResult(formattedResult);

      setBackendOnline(true);

    } catch (error) {
      console.error(
        "AURA analysis error:",
        error
      );

      alert("AURA analysis failed.");

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "--";
    }

    const date = new Date(timestamp);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="aura-app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="aura-logo">

          <div className="logo-orbit">

            <div className="logo-core">
              A
            </div>

          </div>

          <h1>AURA</h1>

          <span>
            INTELLIGENCE SYSTEM
          </span>

        </div>

        <nav>

          <button className="nav-item active">
            <span>⌂</span>
            DASHBOARD
          </button>

          <button className="nav-item">
            <span>◉</span>
            ANALYSIS
          </button>

          <button className="nav-item">
            <span>◈</span>
            INCIDENTS
            <b>{incidents.length}</b>
          </button>

          <button
            className="nav-item"
            onClick={
              cameraActive
                ? stopCamera
                : startCamera
            }
          >
            <span>◌</span>
            MONITOR
          </button>

          <button className="nav-item">
            <span>⚙</span>
            SYSTEM
          </button>

        </nav>

        <div className="system-card">

          <small>
            SYSTEM STATUS
          </small>

          <strong>

            <i
              className={
                backendOnline
                  ? ""
                  : "offline"
              }
            ></i>

            {backendOnline
              ? "ALL SYSTEMS ONLINE"
              : "BACKEND OFFLINE"}

          </strong>

          <p>
            AURA v1.0
          </p>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="top-title">
            <span>◆</span>
            AI-POWERED SITUATIONAL AWARENESS
          </div>

          <div className="online">

            <span></span>

            {backendOnline
              ? "SYSTEM ONLINE"
              : "CONNECTING..."}

          </div>

          <div className="datetime">

            AURA CORE

            <small>
              REAL-TIME INTELLIGENCE
            </small>

          </div>

        </header>


        {/* HERO */}

        <section className="hero">

          <div className="hero-text">

            <div className="eyebrow">
              AUTONOMOUS RISK UNDERSTANDING & RESPONSE
            </div>

            <h2>
              See Beyond.
              <br />

              <span>
                Understand Everything.
              </span>

            </h2>

            <p>
              AURA transforms visual information
              into actionable intelligence using
              computer vision, contextual reasoning,
              and automated risk assessment.
            </p>

            <div className="feature-row">

              <div>
                <span>◎</span>
                <small>VISION</small>
                <b>OBJECT DETECTION</b>
              </div>

              <div>
                <span>◈</span>
                <small>INTELLIGENCE</small>
                <b>RISK REASONING</b>
              </div>

              <div>
                <span>⚡</span>
                <small>RESPONSE</small>
                <b>REAL-TIME ACTION</b>
              </div>

            </div>

          </div>


          {/* UPLOAD */}

          <div className="upload-section">

            <div className="upload-card">

              {cameraActive ? (

                <div className="camera-view">

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                  />

                  <div className="camera-overlay">

                    <div className="scan-line"></div>

                    <span>
                      ● LIVE AURA MONITOR
                    </span>

                  </div>

                </div>

              ) : !preview ? (

                <label className="drop-zone">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />

                  <div className="upload-icon">
                    ↑
                  </div>

                  <strong>
                    UPLOAD SCENE
                  </strong>

                  <span>
                    Drop an image or click to browse
                  </span>

                  <small>
                    JPG / PNG • MAX 10MB
                  </small>

                </label>

              ) : (

                <div className="preview">

                  <img
                    src={preview}
                    alt="Scene preview"
                  />

                  <div className="preview-status">
                    ● IMAGE READY
                  </div>

                </div>

              )}

            </div>


            {/* CAMERA */}

            {cameraActive ? (

              <div className="camera-controls">

                <button
                  className="capture-button"
                  onClick={
                    captureCameraImage
                  }
                >
                  ● CAPTURE SCENE
                </button>

                <button
                  className="stop-camera-button"
                  onClick={stopCamera}
                >
                  STOP CAMERA
                </button>

              </div>

            ) : (

              <button
                className="camera-button"
                onClick={startCamera}
              >
                ◉ OPEN LIVE CAMERA
              </button>

            )}


            {/* ANALYZE */}

            <button
              className="analyze-button"
              onClick={analyzeImage}
              disabled={
                loading || !image
              }
            >

              {loading
                ? "AURA IS ANALYZING..."
                : "ANALYZE SCENE"}

              <span>
                →
              </span>

            </button>

          </div>


          {/* ENGINE */}

          <div className="engine-card">

            <h3>
              ◆ AURA ENGINE
            </h3>

            <div>
              <strong>
                YOLO VISION
              </strong>

              <small>
                OBJECT DETECTION
              </small>
            </div>

            <div>
              <strong>
                RISK ENGINE
              </strong>

              <small>
                THREAT ASSESSMENT
              </small>
            </div>

            <div>
              <strong>
                CONTEXT AI
              </strong>

              <small>
                SCENE UNDERSTANDING
              </small>
            </div>

            <div>
              <strong>
                RESPONSE CORE
              </strong>

              <small>
                ACTION RECOMMENDATION
              </small>
            </div>

            <div className="city-lines">
              ╱╲╱╲╱╲
            </div>

          </div>

        </section>


        {/* DASHBOARD */}

        <section className="dashboard-grid">

          {/* THREAT */}

          <div className="panel threat-panel">

            <div className="panel-title">

              THREAT ASSESSMENT

              <span>
                ● LIVE
              </span>

            </div>

            <div className="gauge">

              <div className="gauge-inner">

                <strong>
                  {result?.risk_score ?? 0}
                </strong>

                <span>
                  / 100
                </span>

              </div>

            </div>

            <div
              className={`risk-label ${
                result?.risk_level
                  ?.toLowerCase() ||
                "low"
              }`}
            >
              {result?.risk_level ||
                "NO THREAT"}
            </div>

          </div>


          {/* ENVIRONMENT */}

          <div className="panel">

            <div className="panel-title">
              ENVIRONMENTAL INTELLIGENCE
            </div>

            <div className="metrics">

              <div className="metric">

                <span>♙</span>

                <strong>
                  {result?.people_count ?? 0}
                </strong>

                <b>
                  PEOPLE
                </b>

                <small>
                  DETECTED
                </small>

              </div>


              <div className="metric">

                <span>▣</span>

                <strong>
                  {result?.vehicle_count ?? 0}
                </strong>

                <b>
                  VEHICLES
                </b>

                <small>
                  DETECTED
                </small>

              </div>


              <div className="metric">

                <span>◉</span>

                <strong>
                  AI
                </strong>

                <b>
                  VISION
                </b>

                <small>
                  ACTIVE
                </small>

              </div>


              <div className="metric">

                <span>⚡</span>

                <strong>
                  {backendOnline
                    ? "LIVE"
                    : "OFF"}
                </strong>

                <b>
                  ENGINE
                </b>

                <small>
                  {backendOnline
                    ? "ONLINE"
                    : "OFFLINE"}
                </small>

              </div>

            </div>

          </div>


          {/* OBJECT RECOGNITION */}

          <div className="panel">

            <div className="panel-title">
              OBJECT RECOGNITION
            </div>

            {result?.detected_objects?.length > 0 ? (

              result.detected_objects
                .slice(0, 8)
                .map((object, index) => {

                  const confidence =
                    Math.round(
                      object.confidence * 100
                    );

                  return (
                    <div
                      className="object-row"
                      key={index}
                    >

                      <span>
                        {object.name.toUpperCase()}
                      </span>

                      <div className="bar">

                        <div
                          style={{
                            width:
                              `${confidence}%`,
                          }}
                        ></div>

                      </div>

                      <b>
                        {confidence}%
                      </b>

                    </div>
                  );

                })

            ) : (

              <div className="object-row">

                <span>
                  AWAITING
                </span>

                <div className="bar">

                  <div
                    style={{
                      width: "0%",
                    }}
                  ></div>

                </div>

                <b>
                  --
                </b>

              </div>

            )}

          </div>


          {/* REASONING */}

          <div className="panel reasoning">

            <div className="panel-title">
              AURA REASONING
            </div>

            <div className="brain">
              ◉
            </div>

            <div className="reason-list">

              {result?.reasons?.length > 0 ? (

                result.reasons.map(
                  (reason, index) => (

                    <p key={index}>

                      <b>
                        ◆
                      </b>

                      {reason}

                    </p>

                  )
                )

              ) : (

                <>

                  <p>
                    <b>◆</b>
                    Upload a scene to
                    activate AURA reasoning.
                  </p>

                  <p>
                    <b>◆</b>
                    Computer vision will
                    inspect the environment.
                  </p>

                  <p>
                    <b>◆</b>
                    Risk engine will
                    calculate the threat level.
                  </p>

                </>

              )}

            </div>


            <div className="recommendation">

              <small>
                RECOMMENDED ACTION
              </small>

              <strong>

                {result?.risk_level
                  ? result.risk_level ===
                    "HIGH"
                    ? "Immediate attention recommended."
                    : result.risk_level ===
                      "MEDIUM"
                    ? "Continue monitoring the area."
                    : "No immediate action required."
                  : "Awaiting scene analysis..."}

              </strong>

            </div>

          </div>


          {/* INCIDENTS */}

          <div className="panel incidents">

            <div className="panel-title">

              RECENT INCIDENTS

              <button
                onClick={
                  loadIncidents
                }
              >
                REFRESH →
              </button>

            </div>


            {incidents.length === 0 ? (

              <div className="incident">

                <span className="dot"></span>

                <small>
                  --
                </small>

                <span>
                  No incidents recorded
                </span>

                <em>
                  READY
                </em>

              </div>

            ) : (

              incidents
                .slice(0, 5)
                .map((incident) => (

                  <div
                    className="incident"
                    key={incident.id}
                  >

                    <span
                      className={`dot ${
                        incident.risk_level ===
                        "HIGH"
                          ? "red"
                          : incident.risk_level ===
                            "MEDIUM"
                          ? "orange"
                          : "green"
                      }`}
                    ></span>

                    <small>
                      {formatTime(
                        incident.timestamp
                      )}
                    </small>

                    <span>
                      {incident.filename ||
                        "Scene Analysis"}
                    </span>

                    <small>
                      {incident.people_count ?? 0}{" "}
                      people
                    </small>

                    <em>
                      {incident.risk_level}
                    </em>

                    <span>
                      {incident.risk_score}
                    </span>

                    <span>
                      →
                    </span>

                  </div>

                ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;