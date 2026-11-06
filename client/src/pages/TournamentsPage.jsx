import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import StateView from '../components/StateView';
import TournamentCard from '../components/TournamentCard';
import PillFilter from '../components/PillFilter';

export default function TournamentsPage() {
  const { data, loading, error } = useFetch('/api/tournaments');
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').toLowerCase();       // มาจากแถบค้นหา
  const [level, setLevel] = useState('ALL');

  const all = data?.tournaments ?? [];
  const levels = [['ALL', 'ทั้งหมด'], ...[...new Set(all.map(t => t.level))].map(l => [l, l])];
  const list = all.filter(t => (level === 'ALL' || t.level === level) && t.name.toLowerCase().includes(q));

  return (
    <section>
      <h2 className="section-title">รายการแข่งขัน</h2>
      <p className="muted">เรียงตามแต้มของผู้ชนะ — รายการยิ่งสำคัญ ยิ่งให้แต้มสะสมอันดับโลกมาก</p>
      <StateView loading={loading} error={error}>
        <div className="toolbar"><PillFilter options={levels} value={level} onChange={setLevel} /></div>
        <div className="grid">{list.map(t => <TournamentCard key={t.id} t={t} />)}</div>
        {list.length === 0 && <p className="muted">ไม่พบรายการแข่งขัน</p>}
        {data && <p className="note">{data.note}</p>}
      </StateView>
    </section>
  );
}
