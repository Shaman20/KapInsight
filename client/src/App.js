import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LightHouse from './components/LightHouse';
import AnalyzeChart from './components/AnalyzeChart';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard />  </ProtectedRoute>} />
            <Route path="/lighthouse" element={<ProtectedRoute><LightHouse />  </ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><AnalyzeChart />  </ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
