import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Reservations from './pages/Reservations';
import Dashboard from './pages/Dashboard';
import PlantelList from './pages/Plantel/List';
import PlantelForm from './pages/Plantel/Form';
import PlantelProfile from './pages/Plantel/Profile';
import PedigreeStudio from './pages/PedigreeStudio';
import MediaCenter from './pages/MediaCenter';
import Gallery from './pages/MediaCenter/Gallery';
import CampaignList from './pages/MediaCenter/CampaignList';
import CampaignBuilder from './pages/MediaCenter/CampaignBuilder';

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

          {/* Media Center Module */}
          <Route path="media-center" element={<MediaCenter />} />
          <Route path="media-center/gallery" element={<Gallery />} />
          <Route path="media-center/campaigns" element={<CampaignList />} />
          <Route path="media-center/campaigns/new" element={<CampaignBuilder />} />
          <Route path="media-center/campaigns/edit/:id" element={<CampaignBuilder />} />

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
