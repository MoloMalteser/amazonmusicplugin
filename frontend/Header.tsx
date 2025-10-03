import { useState } from "react";

export default function Header({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="header">
      <input 
        placeholder="Search Amazon Music..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <div style={{ position: "relative" }}>
        <img 
          src="/profile.png" 
          alt="Profile" 
          onClick={() => setShowMenu(!showMenu)} 
          style={{ width: "40px", borderRadius: "50%", cursor: "pointer" }} 
        />
        {showMenu && (
          <div style={{ position: "absolute", right: 0, background: "#2a2a2a", borderRadius: "8px", padding: "10px" }}>
            <p onClick={() => console.log("Show Playlists")}>Playlists</p>
            <p onClick={() => console.log("Logout")}>Logout</p>
          </div>
        )}
      </div>
      <button onClick={() => onSearch(query)}>Search</button>
    </div>
  );
}
