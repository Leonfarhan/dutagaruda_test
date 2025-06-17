import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RuangMeeting from './pages/RuangMeeting';
import Dashboard from './pages/Dashboard';
import PesanRuangan from './pages/PesanRuangan';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ruang-meeting" element={<RuangMeeting />} />
            <Route path="/pesan-ruangan" element={<PesanRuangan />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;