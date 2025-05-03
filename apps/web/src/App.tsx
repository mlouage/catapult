import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Deployments from './pages/Deployments'
import Releases from './pages/Releases'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import TeamDetail from './pages/TeamDetail'
import Profile from './pages/Profile'
import Logout from './pages/Logout'
import Login from './pages/Login'
import ReleasesDetail from './pages/ReleasesDetail'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="releases/:releaseId" element={<ReleasesDetail />} />
          <Route path="releases" element={<Releases />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="teams/:teamSlug" element={<TeamDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
