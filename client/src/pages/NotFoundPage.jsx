import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return <section><h2 className="section-title">404 — ไม่พบหน้านี้</h2><Link to="/" className="pill-btn active">← กลับหน้า Home</Link></section>;
}
