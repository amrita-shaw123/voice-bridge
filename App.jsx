import React, { useState, useEffect } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-IN");
  const [listening, setListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const speakText = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  const startSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  const emergencyPhrases = [
    "Help me",
    "Call doctor",
    "I need water",
    "Please call my family",
  ];

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, padding: isMobile ? "20px" : "30px" }}>
        <h1 style={styles.title}>VoiceBridge</h1>
        <p style={styles.subtitle}>Web-based Assistive Communication System</p>

        {/* Communication */}
        <div style={styles.section}>
          <h2 style={styles.heading}>Communication</h2>
          <textarea
            rows="4"
            style={styles.textarea}
            placeholder="Type or speak your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div
            style={{
              ...styles.buttonRow,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button
              style={{ ...styles.primaryBtn, width: isMobile ? "100%" : "auto" }}
              onClick={speakText}
            >
              🔊 Speak
            </button>
            <button
              style={{ ...styles.secondaryBtn, width: isMobile ? "100%" : "auto" }}
              onClick={startSpeechToText}
            >
              🎤 {listening ? "Listening..." : "Speech to Text"}
            </button>
          </div>
        </div>

        {/* Language */}
        <div style={styles.section}>
          <h2 style={styles.heading}>Language</h2>
          <select style={styles.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en-IN">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="bn-IN">Bengali</option>
          </select>
        </div>

        {/* Emergency */}
        <div style={styles.section}>
          <h2 style={{ ...styles.heading, color: "#d32f2f" }}>🚨 Emergency</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px" }}>
            {emergencyPhrases.map((p, i) => (
              <button
                key={i}
                style={{ ...styles.emergencyBtn, width: "100%" }}
                onClick={() => {
                  setText(p);
                  const u = new SpeechSynthesisUtterance(p);
                  u.lang = language;
                  window.speechSynthesis.speak(u);
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "1000px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "5px",
    color: "#1976d2",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: "20px",
    fontSize: "14px",
  },
  section: {
    marginBottom: "20px",
  },
  heading: {
    marginBottom: "10px",
    color: "#333",
    fontSize: "18px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  buttonRow: {
    marginTop: "12px",
    display: "flex",
    gap: "10px",
  },
  primaryBtn: {
    background: "#1976d2",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#eeeeee",
    color: "#333",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  emergencyBtn: {
    background: "#d32f2f",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
  },
};
