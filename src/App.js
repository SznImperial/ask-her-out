import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [answer, setAnswer] = useState(null); // null, "yes", "ofCourse", "no"
  const [hearts, setHearts] = useState([]);
  const [burst, setBurst] = useState([]);
  const [musicStarted, setMusicStarted] = useState(false);

  // Background falling hearts
  useEffect(() => {
    const interval = setInterval(() => {
      const heart = {
        id: Date.now(),
        left: Math.random() * 100,
        size: Math.random() * 20 + 15,
        duration: Math.random() * 5 + 5,
      };
      setHearts((prev) => [...prev, heart]);
      setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== heart.id)), heart.duration * 1000);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle music autoplay after first interaction
  useEffect(() => {
    const music = document.getElementById("bg-music");
    const startMusic = () => {
      if (!musicStarted) {
        music.play().catch(() => console.log("Autoplay blocked"));
        setMusicStarted(true);
      }
    };
    window.addEventListener("click", startMusic);
    return () => window.removeEventListener("click", startMusic);
  }, [musicStarted]);

  const createHeartBurst = () => {
    const burstHearts = [];
    for (let i = 0; i < 50; i++) {
      burstHearts.push({
        id: Date.now() + i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 30 + 20,
        rotate: Math.random() * 360,
      });
    }
    setBurst(burstHearts);
    setTimeout(() => setBurst([]), 3000);
  };

  const handleAnswer = async (choice) => {
    setAnswer(choice);

    // Log click in Firebase
    try {
      await addDoc(collection(db, "responses"), {
        choice,
        timestamp: Date.now(),
      });
      console.log("Logged:", choice);
    } catch (error) {
      console.error("Error logging response:", error);
    }

    // Heart burst only for positive answers
    if (choice === "yes" || choice === "ofCourse") {
      createHeartBurst();
    }
  };

  return (
    <div className="container">
      {/* Background Music */}
      <audio id="bg-music" loop playsInline>
        <source src="/music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Background falling hearts */}
      <div className="hearts-container">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="falling-heart"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
            }}
          >
            💖
          </span>
        ))}
      </div>

      {/* Heart burst on positive answer */}
      <div className="burst-container">
        {burst.map((heart) => (
          <span
            key={heart.id}
            className="burst-heart"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: `${heart.size}px`,
              transform: `rotate(${heart.rotate}deg)`,
            }}
          >
            💕
          </span>
        ))}
      </div>

      {!answer ? (
        <>
          <h1 className="intro">Hey Fisayo.....💖</h1>

          <div className="speech">
            <p>
              From the very first moment our paths crossed, I felt something I couldn’t explain… like the universe quietly whispering that you were going to mean something to me. 🌹
            </p>
            <p>
              You’ve painted my days with colors I didn’t know I was missing, turning ordinary moments into memories I can’t stop replaying. 🎨
            </p>
            <p>
              Your smile feels like sunlight breaking through the clouds, and your voice is the calm that silences every storm inside me. ☀️🌊
            </p>
            <p>
              Every laugh we’ve shared, every glance, every little moment—it’s all etched in my heart like a story I never want to end. 📖✨
            </p>
            <p>
              Sometimes I catch myself smiling out of nowhere, only to realize it’s because of you. You’ve become my favorite thought, my sweetest distraction, and the reason I look forward to tomorrow. 💭💕
            </p>
            <p>
              And the truth is… I don’t want to just admire you from afar. I want to be the one who makes you feel special, cared for, and endlessly loved. 💞
            </p>
            <p className="final">
              So here I am, not with flowers or grand gestures, but with the most genuine words I can give you… straight from the heart. ❤️
            </p>
          </div>

          <div className="question">
            <h2>Will you be my girlfriend? 💍💘</h2>
            <button onClick={() => handleAnswer("yes")} className="yesBtn">Yes 💖</button>
            <button onClick={() => handleAnswer("ofCourse")} className="yesBtn">Of course 💕</button>
            <button onClick={() => handleAnswer("no")} className="noBtn">No 😢</button>
          </div>
        </>
      ) : answer === "no" ? (
        <div className="answer">
          <h1>Oh… I guess that’s okay 😔</h1>
          <p>Thank you for being honest. 💙</p>
        </div>
      ) : (
        <div className="answer">
          <h1>You just made me the happiest person alive… I promise you’ll never regret this 💘✨</h1>
        </div>
      )}
    </div>
  );
}

export default App;
