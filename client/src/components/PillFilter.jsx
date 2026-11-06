// props: options [[key,label]], value, onChange
export default function PillFilter({ options, value, onChange }) {
  return (
    <>
      {options.map(([key, label]) => (
        <button key={key} className={`pill-btn ${value === key ? 'active' : ''}`} onClick={() => onChange(key)}>{label}</button>
      ))}
    </>
  );
}
