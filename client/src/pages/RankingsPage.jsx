import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import StateView from '../components/StateView';
import PillFilter from '../components/PillFilter';
import FormChips from '../components/FormChips';

const SORTS = [["wins", "ชนะมากสุด"], ["winRate", "Win rate"], ["matches", "จำนวนนัด"]];

// อันดับทีมชาติ (ข้อมูลและ Merge Sort เดิมของโปรเจกต์)
export default function RankingsPage() {
  const [sort, setSort] = useState("wins");
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').toLowerCase();
  const { data, loading, error } = useFetch(`/api/rankings?sort=${sort}&order=desc`);
  const list = (data ?? []).filter(t => t.country.toLowerCase().includes(q));

  return (
    <section>
      <h2 className="section-title">อันดับทีมชาติ</h2>
      <div className="toolbar"><PillFilter options={SORTS} value={sort} onChange={setSort} /></div>
      <StateView loading={loading} error={error}>
        <table className="rank-table">
          <thead><tr><th>#</th><th>ทีม</th><th>นัด</th><th>ชนะ</th><th>Win%</th><th>ฟอร์ม</th></tr></thead>
          <tbody>
            {list.map((t, i) => (
              <tr key={t.id}>
                <td className="rank">{i + 1}</td>
                <td>{t.flag} {t.country}</td>
                <td>{t.matches}</td>
                <td>{t.wins}</td>
                <td>{t.winRate}%</td>
                <td><FormChips form={t.form} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted">ไม่พบทีมที่ค้นหา</p>}
      </StateView>
    </section>
  );
}
