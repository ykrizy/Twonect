import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import ComoFunciona from '@/pages/ComoFunciona'
import ParaEmpresas from '@/pages/ParaEmpresas'
import ParaEspecialistas from '@/pages/ParaEspecialistas'
import Precos from '@/pages/Precos'
import SobreNos from '@/pages/SobreNos'
import Registar from '@/pages/Registar'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import PublicarProjeto from '@/pages/PublicarProjeto'
import Matching from '@/pages/Matching'
import Calculadora from '@/pages/Calculadora'
import Marketplace from '@/pages/Marketplace'
import OnboardingEspecialista from '@/pages/OnboardingEspecialista'
import CriarServico from '@/pages/CriarServico'
import Projeto from '@/pages/Projeto'
import Mensagens from '@/pages/Mensagens'
import EspecialistaPublico from '@/pages/EspecialistaPublico'
import Admin from '@/pages/Admin'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="como-funciona" element={<ComoFunciona />} />
          <Route path="para-empresas" element={<ParaEmpresas />} />
          <Route path="para-especialistas" element={<ParaEspecialistas />} />
          <Route path="precos" element={<Precos />} />
          <Route path="sobre-nos" element={<SobreNos />} />
          <Route path="registar" element={<Registar />} />
          <Route path="login" element={<Login />} />
          <Route path="matching" element={<Matching />} />
          <Route path="calculadora" element={<Calculadora />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="onboarding-especialista" element={<ProtectedRoute><OnboardingEspecialista /></ProtectedRoute>} />
          <Route path="criar-servico" element={<ProtectedRoute><CriarServico /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="publicar-projeto" element={<ProtectedRoute><PublicarProjeto /></ProtectedRoute>} />
          <Route path="projeto/:id" element={<ProtectedRoute><Projeto /></ProtectedRoute>} />
          <Route path="mensagens" element={<ProtectedRoute><Mensagens /></ProtectedRoute>} />
          <Route path="especialista/:id" element={<EspecialistaPublico />} />
          <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
