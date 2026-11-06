import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { pageGraph, pagePaths, pageLabels, checkGraph, nodeFromPath } from './graph';
import SearchBar from './components/SearchBar';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import TournamentsPage from './pages/TournamentsPage';
import RankingsPage from './pages/RankingsPage';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';

// NavBar = edges ของหน้าปัจจุบัน (ทุก <Link> บนจอ = 1 edge ใน pageGraph)
function NavBar() {
  const { pathname } = useLocation();
  const current = nodeFromPath(pathname) ?? "home";
  return (
    <header className="nav">
      <Link to="/" className="brand">COURT<em>RANKINGS</em></Link>
      <nav>
        {pageGraph[current].map(n => <Link key={n} to={pagePaths[n]}>{pageLabels[n]}</Link>)}
      </nav>
      <SearchBar />
    </header>
  );
}

// ตรวจ graph ด้วย BFS ครั้งเดียวตอนโหลดแอป
const { orphans, deadEnds } = checkGraph();
console.log("ไปไม่ถึงจาก home:", orphans);   // ต้องได้ []
console.log("ทางตัน:", deadEnds);             // ต้องได้ []

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/detail" element={<DetailPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
