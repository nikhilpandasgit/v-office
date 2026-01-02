import { useState } from "react";
import Header from "../../components/header";

export default function CreateCharacter({ session }) {
  const characters = [
    "/character-sprite/Cody.png",
    "/character-sprite/Jenna.png",
    "/character-sprite/John.png",
    "/character-sprite/Emily.png",
    "/character-sprite/Joe.png",
    "/character-sprite/Noah.png",
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [characterName, setCharacterName] = useState("");

  return (
    <div>
      <Header user={session.user} />
      <div className="cc-container">
        <div className="cc-flex-1">
          <h1>Create Your Character</h1>
          <p style={{ color: "#999", marginBottom: "3rem" }}>
            Pick your sprite, name, vibe, destiny, etc.
          </p>
          <button
            className={`cc-create-btn ${characterName.trim() ? "cc-enabled" : "cc-disabled"
              }`}
            disabled={!characterName.trim()}
            onClick={()=> {
              console.log(characterName, characters[selectedIndex])
            }}
          >
            Create Character
          </button>
        </div>

        <div className="cc-flex-2">
          <div className="cc-card">
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", marginTop: "0" }}>
              Choose Your Character
            </h2>

            <div className="cc-carousel">
              <button
                className="cc-arrow"
                onClick={() =>
                  setSelectedIndex(
                    selectedIndex === 0
                      ? characters.length - 1
                      : selectedIndex - 1
                  )
                }
              >
                ‹
              </button>

              <div className="cc-character-box">
                <img
                  src={characters[selectedIndex]}
                  alt="Selected character"
                  className="cc-pixel"
                  width={84}
                  height={84}
                />
              </div>

              <button
                className="cc-arrow"
                onClick={() =>
                  setSelectedIndex(
                    selectedIndex === characters.length - 1
                      ? 0
                      : selectedIndex + 1
                  )
                }
              >
                ›
              </button>
            </div>

            <div className="cc-preview-grid">
              {characters.map((char, index) => (
                <div
                  key={index}
                  className={`cc-preview ${selectedIndex === index ? "cc-active" : ""
                    }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={char}
                    alt={`Character ${index + 1}`}
                    className="cc-pixel"
                    width={24}
                    height={24}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div className="cc-card">
            <label style={{ marginBottom: "0.5rem", display: "block" }}>
              Character Name
            </label>
            <input
              className="cc-input"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter character name..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
