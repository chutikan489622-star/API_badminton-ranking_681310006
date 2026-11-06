import useFetch from '../hooks/useFetch';
import StateView from '../components/StateView';
import PlayerCard from '../components/PlayerCard';
import TournamentCard from '../components/TournamentCard';
import StatBox from '../components/StatBox';

export default function HomePage() {
  const { data, loading, error } = useFetch('/api/home');
  return (
    <section>
      <div className="hero">
        <h1>BWF WORLD <em>RANKINGS</em></h1>
        <p>Live Analytics — นักกีฬาแบดมินตัน สถิติการแข่งขัน และการจัดอันดับระดับโลก</p>
      </div>
      <StateView loading={loading} error={error}>
        {data && (
          <>
            <div className="stats-row">
              <StatBox value={data.totals.players} label="นักกีฬา" />
              <StatBox value={data.totals.tournaments} label="รายการแข่งขัน" />
              <StatBox value={`${data.topTeam.flag} ${data.topTeam.country}`} label="ทีมชาติชนะมากที่สุด" />
            </div>

            <h2 className="section-title">มือวางอันดับ 1</h2>
            <div className="grid">
              <PlayerCard big player={data.topMS[0]} badge="เดี่ยวชาย" />
              <PlayerCard big player={data.topWS[0]} badge="เดี่ยวหญิง" />
            </div>

            <h2 className="section-title">Top 3 เดี่ยวชาย</h2>
            <div className="grid">{data.topMS.map(p => <PlayerCard key={p.id} player={p} badge={`#${p.rank}`} />)}</div>

            <h2 className="section-title">Top 3 เดี่ยวหญิง</h2>
            <div className="grid">{data.topWS.map(p => <PlayerCard key={p.id} player={p} badge={`#${p.rank}`} />)}</div>

            <h2 className="section-title">รายการแข่งขันสำคัญ</h2>
            <div className="grid">{data.tournaments.map(t => <TournamentCard key={t.id} t={t} />)}</div>
            <p className="note">{data.note}</p>
          </>
        )}
      </StateView>
    </section>
  );
}
