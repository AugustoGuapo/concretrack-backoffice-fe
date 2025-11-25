import { useState } from "react";

export default function ClientInputForm({ onBack }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("El nombre no puede estar vacío.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${backendUrl}/clients`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Error inesperado");
            }

            onBack();
        } catch (err) {
            setError(err.message || "No se pudo crear el cliente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 relative">
            
            {/* --- BOTÓN X --- */}
            <button
                onClick={onBack}
                className="absolute right-4 top-4 text-gray-600 hover:text-black text-2xl font-bold"
            >
                ×
            </button>

            <h1 className="text-xl font-bold mb-4">Crear Cliente</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow max-w-md"
            >
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Nombre</span>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
