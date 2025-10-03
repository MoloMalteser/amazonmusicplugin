export default function SongCard({ song }: { song: any }) {
  return (
    <div className="song-card">
      <img src={song.coverUrl} alt={song.name} />
      <h4>{song.name}</h4>
      <p>{song.artist}</p>
    </div>
  );
}
