import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import StateView from '../components/StateView';
import PlayerCard from '../components/PlayerCard';
import PillFilter from '../components/PillFilter';

const EVENTS = [["ALL", "ทั้งหมด"], ["MS", "เดี่ยวชาย"], ["WS", "เดี่ยวหญิง"]];
const SORTS = [["points", "คะแนนโลก"], ["winRate", "Win rate"], ["titles", "แชมป์"]];

export default function PlayersPage() {
  const [event, setEvent] = useState("ALL");
  const [sort, setSort] = useState("points");
  const { data, loading, error } = useFetch(`/api/players?event=${event}&sort=${sort}`);

  return (
    <section>
      <h2 className="section-title">นักกีฬา</h2>
      <div className="toolbar">
        <PillFilter options={EVENTS} value={event} onChange={setEvent} />
        <span className="muted sep">เรียงตาม</span>
        <PillFilter options={SORTS} value={sort} onChange={setSort} />
      </div>
      <StateView loading={loading} error={error}>
        {data && (
          <>
            <div className="grid">{data.players.map(p => <PlayerCard key={p.id} player={p} />)}</div>
            <p className="note">{data.note}</p>
          </>
        )}
      </StateView>
    </section>
  );
}
