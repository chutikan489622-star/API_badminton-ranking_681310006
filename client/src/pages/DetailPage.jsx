import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import StateView from '../components/StateView';
import PlayerPhoto from '../components/PlayerPhoto';
import StatBox from '../components/StatBox';
import FormChips from '../components/FormChips';

export default function DetailPage() {
  const { id } = useParams();
  // ไม่มี id → มือวางอันดับ 1 ; มี id → ค้นด้วย Hash Table ฝั่ง server
  const { data, loading, error } = useFetch(id ? `/api/players/${id}` : '/api/players/top');
  const p = data?.player;

  return (
    <StateView loading={loading} error={error}>
      {p && (
        <section className="detail">
          <PlayerPhoto player={p} size={160} />
          <div>
            <h2 className="section-title">{p.flag} {p.name}</h2>
            <p className="muted">{p.country} · {p.event === 'MS' ? 'เดี่ยวชาย' : 'เดี่ยวหญิง'} · อายุ {p.age} ปี</p>
            <div className="stats-row">
              <StatBox value={`#${p.rank}`} label="อันดับโลก" />
              <StatBox value={p.points.toLocaleString()} label="คะแนนสะสม" />
              <StatBox value={p.titles} label="แชมป์ซีซัน" />
            </div>
            <p>ชนะ {p.wins} · แพ้ {p.losses} · รวม {p.matches} นัด</p>
            <div className="bar"><div style={{ width: `${p.winRate}%` }} /></div>
            <p className="muted">Win rate {p.winRate}%</p>
            <p>5 นัดล่าสุด: <FormChips form={p.form} /></p>
            <p className="note">{data.note}</p>
            <Link to="/players" className="pill-btn">← กลับรายชื่อนักกีฬา</Link>
          </div>
        </section>
      )}
    </StateView>
  );
}
