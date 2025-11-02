import { useState, useEffect } from "react";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import FamilyInputForm from "./components/FamilyInputForm";

export default function App() {
  useEffect(() => {
    // Solo se ejecuta en navegador
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.onload = () => {
        // Inicializa Eruda
        window.eruda && window.eruda.init();
      };
      document.body.appendChild(script);
    }
  }, []);

  let viewDefault = localStorage.getItem("user_id") == null ? "login" : "dashboard";
  const [view, setView] = useState(viewDefault);

  if (view === "login") return <Login onLogin={() => setView("dashboard")} />;
  if (view === "dashboard" || localStorage.getItem("user_id") != null)
    return <Dashboard onNavigate={setView} />;
  if (view === "form") return <FamilyInputForm onBack={() => setView("dashboard")} />;
}
