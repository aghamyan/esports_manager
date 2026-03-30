import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import MatchesPage from './pages/MatchesPage';
import TournamentsPage from './pages/TournamentsPage';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>FC26 Manager</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/players">Players</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/tournaments">Tournaments</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
