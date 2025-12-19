import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Reservations from './pages/Reservations';
import Dashboard from './pages/Dashboard';
import PlantelList from './pages/Plantel/List';
import PlantelForm from './pages/Plantel/Form';
import PlantelProfile from './pages/Plantel/Profile';
import PedigreeStudio from './pages/PedigreeStudio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cadastros/reservas" element={<Reservations />} />

          {/* Plantel Module */}
          <Route path="plantel" element={<PlantelList />} />
          <Route path="plantel/novo" element={<PlantelForm />} />
          <Route path="plantel/editar/:id" element={<PlantelForm />} />
          <Route path="plantel/:id" element={<PlantelProfile />} />
          <Route path="pedigree-studio" element={<PedigreeStudio />} />

          <Route path="vendas" element={<div>Vendas Module</div>} />
          <Route path="caes" element={<div>Cães Module (Use Plantel)</div>} />
          <Route path="ninhadas" element={<div>Ninhadas Module</div>} />
          <Route path="financeiro" element={<div>Financeiro Module</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
