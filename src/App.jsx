import { useState } from "react";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FamilyInputForm from "./components/FamilyInputForm";
import ClientInputForm from "./components/ClientInputForm";
import ProjectInputForm from "./components/ProjectInputForm";
import MemberInputForm from "./components/MemberInputForm";

export default function App() {

  let viewDefault = localStorage.getItem("user_id") == null ? "login" : "dashboard";
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [view, setView] = useState(viewDefault);

  // Login fuera del layout
  if (view === "login") {
    return <Login onLogin={() => setView("dashboard")} />;
  }

  // Todo lo demás dentro del layout
  return (
    <Layout user={user}>
      {view === "dashboard" && (
        <Dashboard onNavigate={setView} />
      )}
      {view === "form-client" && (
        <ClientInputForm onBack={() => setView("dashboard")} />
      )}
      {view === "form-project" && (
        <ProjectInputForm onBack={() => setView("dashboard")} />
      )}
      {view === "form-family" && (
        <FamilyInputForm onBack={() => setView("dashboard")} />
      )}
      {view === "form-members" && (
        <MemberInputForm onBack={() => setView("dashboard")} />
      )}

    </Layout>
  );
}
