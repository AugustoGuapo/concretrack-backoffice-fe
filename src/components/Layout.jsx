export default function Layout({ children, user }) {

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");
    // Opcional: redirigir a login
    window.location.href = "/";
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Usuario";

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <header className="p-4 bg-gray-800 text-white flex items-center justify-between">
        <h1 className="text-xl font-bold">Concretrack 🔨</h1>
        <p>Bienvenido { fullName }</p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Contenido dinámico */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 bg-gray-200 text-center text-sm">
        © {new Date().getFullYear()} Concretrack
      </footer>

    </div>
  );
}
