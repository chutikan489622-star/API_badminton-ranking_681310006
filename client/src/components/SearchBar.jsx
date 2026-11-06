import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ช่องค้นหารวม: นักกีฬา / ประเทศ / รายการแข่งขัน (เรียก /api/search/all ซึ่งใช้ Hash Table)
export default function SearchBar() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const box = useRef(null);

  // debounce 250ms เพื่อไม่ยิง API ทุกตัวอักษร
  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    const timer = setTimeout(() => {
      fetch(`/api/search/all?q=${encodeURIComponent(q)}`)
        .then(r => r.json()).then(setResults).catch(() => setResults(null));
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  // ปิดรายการเมื่อคลิกนอกกล่อง
  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const go = (path) => { setOpen(false); setQ(''); navigate(path); };
  const empty = results && !results.players.length && !results.countries.length && !results.tournaments.length;

  return (
    <div className="searchbox" ref={box}>
      <input value={q} placeholder="🔍 ค้นหานักกีฬา / ประเทศ / รายการแข่งขัน"
             onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
      {open && results && (
        <div className="dropdown">
          {results.players.map(p => <button key={p.id} onClick={() => go(`/detail/${p.id}`)}>{p.flag} {p.name} <small>นักกีฬา</small></button>)}
          {results.countries.map(c => <button key={c.id} onClick={() => go(`/rankings?q=${encodeURIComponent(c.country)}`)}>{c.flag} {c.country} <small>ทีมชาติ</small></button>)}
          {results.tournaments.map(t => <button key={t.id} onClick={() => go(`/tournaments?q=${encodeURIComponent(t.name)}`)}>🏆 {t.name} <small>รายการ</small></button>)}
          {empty && <p className="muted pad">ไม่พบผลลัพธ์</p>}
        </div>
      )}
    </div>
  );
}
