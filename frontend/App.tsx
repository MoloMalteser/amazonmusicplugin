import { useState, useEffect } from "react";
import Header from "./Header";
import SongCard from "./SongCard";
import LoginModal from "./LoginModal";

export default function App() {
  const [results, setResults] = useState<any[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", email, password);
    setLoggedIn(true);
  };

  const handleSearch = async (query: string) => {
    const plugin = window.deckyApi.plugin as any;
    const res = await plugin.searchSong(query);
    setResults(res);
  };

  return (
    <div>
      {!loggedIn && <LoginModal onLogin={handleLogin} />}
      <Header onSearch={handleSearch} />
      <h2>Empfehlungen</h2>
      <div style={{ display: "flex", overflowX: "scroll" }}>
        {results.map((r, i) => <SongCard key={i} song={r[1]} />)}
      </div>
    </div>
  );
}
