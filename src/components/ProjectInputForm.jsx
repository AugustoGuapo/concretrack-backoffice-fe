import { useEffect, useState } from "react";

export default function ProjectInputForm({ onBack }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [name, setName] = useState("");
    const [clientId, setClientId] = useState(null);
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [clientSearch, setClientSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar clientes al montar
    useEffect(() => {
        async function loadClients() {
            try {
                const res = await fetch(`${backendUrl}/clients`);
                if (!res.ok) throw new Error("No se pudieron cargar los clientes");
                const data = await res.json();

                setClients(data);
                setFilteredClients(data);
            } catch (err) {
                setError(err.message);
            }
        }
        loadClients();
    }, [backendUrl]);

    // Filtrar clientes cuando se escribe
    useEffect(() => {
        const term = clientSearch.toLowerCase();
        setFilteredClients(
            clients.filter(c => c.name.toLowerCase().includes(term))
        );
    }, [clientSearch, clients]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("El nombre no puede estar vacío.");
            return;
        }

        if (!clientId) {
            setError("Debe seleccionar un cliente.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${backendUrl}/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    client_id: clientId
                })
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Error inesperado creando el proyecto");
            }

            onBack();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 relative">

            {/* Botón X */}
            <button
                onClick={onBack}
                className="absolute right-4 top-4 text-gray-600 hover:text-black text-2xl font-bold"
            >
                ×
            </button>

            <h1 className="text-xl font-bold mb-4">Crear Proyecto</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow max-w-md"
            >
                {/* Nombre del proyecto */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Nombre</span>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                {/* Selector de cliente con búsqueda */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Cliente</span>

                    <input
                        type="text"
                        placeholder="Buscar cliente…"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                    />

                    <div className="border rounded-lg mt-2 max-h-40 overflow-y-auto bg-white">
                        {filteredClients.length === 0 ? (
                            <div className="p-2 text-gray-500">
                                No hay coincidencias
                            </div>
                        ) : (
                            filteredClients.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => {
                                        setClientId(c.id);
                                        setClientSearch(c.name);
                                    }}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                        clientId === c.id ? "bg-blue-100" : ""
                                    }`}
                                >
                                    {c.name}
                                </div>
                            ))
                        )}
                    </div>
                </label>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-white 
                            ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
                        `}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                </div>
            </form>

            {/* Modal de error */}
            {error && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow w-80">
                        <h2 className="text-lg font-bold text-red-600 mb-3">Error</h2>
                        <p className="text-gray-800">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="w-full mt-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
