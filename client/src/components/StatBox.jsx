// props: value, label
export default function StatBox({ value, label }) {
  return <div className="stat"><b>{value}</b><span>{label}</span></div>;
}
