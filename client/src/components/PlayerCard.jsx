import { Link } from 'react-router-dom';
import PlayerPhoto from './PlayerPhoto';
import FormChips from './FormChips';

// props: player, badge (ข้อความมุมการ์ด, ไม่บังคับ), big (การ์ดใหญ่สำหรับหน้า Home)
export default function PlayerCard({ player, badge, big = false }) {
  return (
    <Link to={`/detail/${player.id}`} className={`player-card ${big ? 'big' : ''}`}>
      {badge && <span className="tag">{badge}</span>}
      <PlayerPhoto player={player} size={big ? 96 : 72} />
      <div>
        <h3>{player.flag} {player.name}</h3>
        <p className="muted">อันดับโลก #{player.rank} · {player.event === 'MS' ? 'เดี่ยวชาย' : 'เดี่ยวหญิง'}</p>
        <p>{player.points.toLocaleString()} คะแนน · ชนะ {player.winRate}%</p>
        <FormChips form={player.form} />
      </div>
    </Link>
  );
}
