// props: loading, error, children
export default function StateView({ loading, error, children }) {
  if (loading) return <p className="muted">กำลังโหลดข้อมูล…</p>;
  if (error) return <p className="error">⚠ {error}</p>;
  return children;
}
