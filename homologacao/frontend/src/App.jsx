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
import AlbumDetails from './pages/MediaCenter/AlbumDetails';
import CampaignList from './pages/MediaCenter/CampaignList';
import CampaignBuilder from './pages/MediaCenter/CampaignBuilder';
import SharedAlbum from './pages/SharedAlbum';
import FunilVendas from './pages/CRM/FunilVendas';
import Contratos from './pages/Comercial/Contratos';
import CalendarioCios from './pages/Reproducao/CalendarioCios';
import PlanejadorCruzas from './pages/Reproducao/PlanejadorCruzas';
import Gestacao from './pages/Reproducao/Gestacao';
import Protocolos from './pages/Saude/Protocolos';
import AgendaSanitaria from './pages/Saude/AgendaSanitaria';
import HistoricoClinico from './pages/Saude/HistoricoClinico';
import FluxoCaixa from './pages/Financeiro/FluxoCaixa';
import AnalisePorCao from './pages/Financeiro/AnalisePorCao';
import Estoque from './pages/Financeiro/Estoque';
import Compras from './pages/Financeiro/Compras';
import Catalogo from './pages/Loja/Catalogo';
import Pedidos from './pages/Loja/Pedidos';
import Usuarios from './pages/Configuracoes/Usuarios';
import Modelos from './pages/Configuracoes/Modelos';
import Integracoes from './pages/Configuracoes/Integracoes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/album/:token" element={<SharedAlbum />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          {/* Comercial Module */}
          <Route path="crm/funil-vendas" element={<FunilVendas />} />
          <Route path="cadastros/reservas" element={<Reservations />} />
          <Route path="comercial/contratos" element={<Contratos />} />

          {/* Plantel Module */}
          <Route path="plantel" element={<PlantelList />} />
          <Route path="plantel/novo" element={<PlantelForm />} />
          <Route path="plantel/editar/:id" element={<PlantelForm />} />
          <Route path="plantel/:id" element={<PlantelProfile />} />
          <Route path="pedigree-studio" element={<PedigreeStudio />} />

          {/* Reprodução Module */}
          <Route path="reproducao/calendario-cios" element={<CalendarioCios />} />
          <Route path="reproducao/planejador-cruzas" element={<PlanejadorCruzas />} />
          <Route path="reproducao/gestacao" element={<Gestacao />} />

          {/* Ninhadas Module */}
          <Route path="ninhadas" element={<div>Ninhadas Module</div>} />

          {/* Saúde Module */}
          <Route path="saude/protocolos" element={<Protocolos />} />
          <Route path="saude/agenda" element={<AgendaSanitaria />} />
          <Route path="saude/historico" element={<HistoricoClinico />} />

          {/* Financeiro Module */}
          <Route path="financeiro/fluxo-caixa" element={<FluxoCaixa />} />
          <Route path="financeiro/analise-cao" element={<AnalisePorCao />} />
          <Route path="financeiro/estoque" element={<Estoque />} />
          <Route path="financeiro/compras" element={<Compras />} />

          {/* Loja e Mídias Module */}
          <Route path="loja/catalogo" element={<Catalogo />} />
          <Route path="loja/pedidos" element={<Pedidos />} />

          {/* Media Center Module (Galeria de Mídias) */}
          <Route path="media-center" element={<MediaCenter />} />
          <Route path="media-center/gallery" element={<Gallery />} />
          <Route path="media-center/album/:id" element={<AlbumDetails />} />
          <Route path="media-center/campaigns" element={<CampaignList />} />
          <Route path="media-center/campaigns/new" element={<CampaignBuilder />} />
          <Route path="media-center/campaigns/edit/:id" element={<CampaignBuilder />} />

          {/* Configurações Module */}
          <Route path="configuracoes/usuarios" element={<Usuarios />} />
          <Route path="configuracoes/modelos" element={<Modelos />} />
          <Route path="configuracoes/integracoes" element={<Integracoes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
