import { Navigate, Route, Routes } from "react-router-dom";
import './App.css'
import PageLayout from './layouts/PageLayout';
import HomePage from './pages/HomePage/HomePage'
import LoginPage from "./pages/LoginPage/LoginPage";
import QrCode from "./pages/QrCode/QrCode";
import QrLandingPage from "./pages/QrCode/QrLandingPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="qr" element={<QrCode />} />
        <Route path="qr-landing-page" element={<QrLandingPage />} />
      </Route>
    </Routes>
  )
}

export default App
