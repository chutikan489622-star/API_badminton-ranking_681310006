// props: form เช่น "W-W-L-W-W" → ชิปสีเขียว/แดง
export default function FormChips({ form }) {
  return (
    <span className="chips" title="ผลการแข่งขัน 5 นัดล่าสุด (ซ้าย→ขวา)">
      {form.split('-').map((r, i) => <span key={i} className={`chip ${r === 'W' ? 'win' : 'loss'}`}>{r === 'W' ? 'ช' : 'พ'}</span>)}
    </span>
  );
}
