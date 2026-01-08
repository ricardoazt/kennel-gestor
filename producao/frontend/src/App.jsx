import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Reservations from './pages/Reservations';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cadastros/reservas" element={<Reservations />} />
          <Route path="vendas" element={<div>Vendas Module</div>} />
          <Route path="caes" element={<div>Cães Module</div>} />
          <Route path="ninhadas" element={<div>Ninhadas Module</div>} />
          <Route path="financeiro" element={<div>Financeiro Module</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
