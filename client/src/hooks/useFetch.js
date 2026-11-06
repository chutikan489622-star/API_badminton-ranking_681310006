import { useState, useEffect } from 'react';

// ดึงข้อมูลจาก API ทุกครั้งที่ url เปลี่ยน
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.status === 404 ? 'ไม่พบข้อมูล' : 'โหลดข้อมูลไม่สำเร็จ'); return r.json(); })
      .then(d => { if (!cancelled) { setData(d); setError(null); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };   // กัน setState หลัง unmount / url เปลี่ยน
  }, [url]);

  return { data, loading, error };
}
