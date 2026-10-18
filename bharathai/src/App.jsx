import { useCallback } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AIForecast from "./aiforecast.jsx";
import Calculator from "./calculator.jsx";
import Comparison from "./comparision.jsx";
import MandiIntel from "./mandi.jsx";
import Overview from "./Overview.jsx";

const routesByPage = {
  Overview: "/overview",
  "Mandi Intel": "/mandi-intel",
  "AI Forecast": "/ai-forecast",
  Calculator: "/calculator",
  Comparison: "/comparison",
  Comparisons: "/comparison",
};

function DashboardRoutes() {
  const navigate = useNavigate();
  const navigateToPage = useCallback(
    (page) => {
      const path = routesByPage[page];
      if (path) navigate(path);
    },
    [navigate],
  );

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/overview" replace />}
      />
      <Route path="/overview" element={<Overview />} />
      <Route
        path="/mandi-intel"
        element={<MandiIntel onNavigate={navigateToPage} />}
      />
      <Route
        path="/ai-forecast"
        element={<AIForecast onNavigate={navigateToPage} />}
      />
      <Route
        path="/calculator"
        element={<Calculator onNavigate={navigateToPage} />}
      />
      <Route
        path="/comparison"
        element={<Comparison onNavigate={navigateToPage} />}
      />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardRoutes />
    </BrowserRouter>
  );
}
