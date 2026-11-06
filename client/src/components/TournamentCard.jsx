// props: t (tournament)
export default function TournamentCard({ t }) {
  return (
    <article className="player-card col">
      <span className="pill">{t.level}</span>
      <h3>{t.name}</h3>
      <p className="muted">📍 {t.city}, {t.country}</p>
      <p>🗓 {t.month} · 🏆 แต้มผู้ชนะ {t.winnerPoints.toLocaleString()}</p>
      {t.note && <p className="muted">{t.note}</p>}
    </article>
  );
}
