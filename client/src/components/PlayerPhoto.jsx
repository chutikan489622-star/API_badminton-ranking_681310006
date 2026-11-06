import { useState } from 'react';

// props: player, size — ถ้าโหลดรูปไม่ได้ จะแสดงอวตารตัวอักษรย่อ
export default function PlayerPhoto({ player, size = 72 }) {
  const [failed, setFailed] = useState(false);
  const initials = player.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  if (failed || !player.photo) {
    return <div className="avatar" style={{ width: size, height: size, fontSize: size / 3 }}>{initials}</div>;
  }
  return <img className="photo" src={player.photo} alt={player.name} width={size} height={size} onError={() => setFailed(true)} />;
}
