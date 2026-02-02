import { useEffect, useState } from "react";
import Header from "../components/header";
import apiCall from '../lib/apiCall';
import { useNavigate } from "react-router-dom";

export default function CreateCharacter({ session }) {

  const [characters, setCharacters] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [characterName, setCharacterName] = useState("");
  const navigate = useNavigate();

  const getSpriteSrc = (character) => `/character-sprite/${character.name}.png`

  useEffect(() => {
    async function guard() {
      const response = await apiCall.get("/get-active-player-by-user-id");
      if (response.data.character_id) {
        navigate("/overview", { replace: true });
      }
    }
    guard();
  }, []);

  useEffect(() => {
    async function getAllCharacters(){
      const response = await apiCall.get('/get-all-characters')
      setCharacters(response.data)
    }
    getAllCharacters();
  }, []);

  useEffect(() => {
    if(characters.length > 0){
      setCharacterName(characters[selectedIndex].name)
    } 
  }, [characters, selectedIndex])

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
            onClick={async () => {
              const response = await apiCall.post("/upsert-character", {
                // id: character.id
                name: characterName,
                character_sprite_set_id: characters[selectedIndex].id
              });
              if(response.status == 200){
                alert("Character Created")
                navigate("/overview", { replace: true });
              }
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
                {characters.length > 0 && (
                  <img
                  src={getSpriteSrc(characters[selectedIndex])}
                  alt={characters[selectedIndex].name}
                  className="cc-pixel cc-main-sprite"
                />
                )}
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
                  key={char.id}
                  className={`cc-preview ${selectedIndex === index ? "cc-active" : ""
                    }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <img
                    src={getSpriteSrc(char)}
                    alt={`${char.name}`}
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
