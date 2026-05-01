import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Threats from './pages/Threats';
import About from './pages/About';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const theme = useSelector(s => s.theme.mode);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
