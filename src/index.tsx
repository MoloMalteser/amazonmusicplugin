import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

interface Track {
  id: string;
  name: string;
  type: string;
}

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>("");

  // Prüfe beim Start, ob bereits eingeloggt
  useEffect(() => {
    axios.get("/login-status").then((res) => {
      if (res.data.loggedIn) setLoggedIn(true);
    });
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post("/login", { email, password });
      if (res.data.success) {
        setLoggedIn(true);
      } else {
        alert("Login fehlgeschlagen: " + res.data.error);
      }
    } catch (e) {
      alert("Login fehlgeschlagen: " + e);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get("/search", { params: { q: query } });
      if (res.data.success) {
        setResults(res.data.results);
      }
    } catch (e) {
      alert("Suche fehlgeschlagen: " + e);
    }
  };

  const handlePlay = async (track: Track) => {
    try {
      const res = await axios.get(`/stream/${track.id}`);
      if (res.data.success) {
        setCurrentTrack(track);
        setStreamUrl(res.data.stream_url);
      } else {
        alert("Fehler beim Abspielen: " + res.data.error);
      }
    } catch (e) {
      alert("Fehler beim Abspielen: " + e);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {!loggedIn ? (
        <div>
          <h2>Amazon Music Login</h2>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Amazon Music Player</h2>
          <input
            type="text"
            placeholder="Song/Album/Playlist suchen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Suchen</button>
          <ul>
            {results.map((track) => (
              <li key={track.id}>
                {track.name} [{track.type}]
                <button onClick={() => handlePlay(track)}>Play</button>
              </li>
            ))}
          </ul>

          {currentTrack && streamUrl && (
            <div>
              <h3>Jetzt läuft: {currentTrack.name}</h3>
              <audio src={streamUrl} controls autoPlay />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
