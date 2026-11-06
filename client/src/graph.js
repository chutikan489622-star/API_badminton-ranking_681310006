// graph.js — directed adjacency list: key = หน้าปัจจุบัน, array = หน้าที่มี <Link> ไปถึง
// students→players, courses→tournaments, profile→rankings (อันดับทีมชาติเดิมของโปรเจกต์)
export const pageGraph = {
  home:        ["players", "tournaments", "rankings"],
  players:     ["home", "detail", "rankings"],
  tournaments: ["home", "rankings"],          // เดิมเป็น [] = ทางตัน → แก้แล้ว
  rankings:    ["home", "players"],
  detail:      ["players", "home"],
};

export const pagePaths = {
  home: "/", players: "/players", tournaments: "/tournaments",
  rankings: "/rankings", detail: "/detail",
};

export const pageLabels = {
  home: "Home", players: "นักกีฬา", tournaments: "รายการแข่งขัน",
  rankings: "อันดับทีมชาติ", detail: "มือวางอันดับ 1",
};

// BFS ด้วย queue + visited Set — O(V+E)
export function canReach(start, end) {
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === end) return true;
    for (const neighbor of pageGraph[current] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}

export function checkGraph() {
  const pages = Object.keys(pageGraph);
  return {
    orphans:  pages.filter(p => !canReach("home", p)),   // ไปไม่ถึงจาก home
    deadEnds: pages.filter(p => !canReach(p, "home")),   // ทางตัน
  };
}

// หา node จาก URL เช่น /detail/jonatan → "detail"
export function nodeFromPath(pathname) {
  const seg = pathname.split('/')[1];
  return Object.keys(pagePaths).find(n => pagePaths[n].split('/')[1] === seg) ?? null;
}
