import { useEffect, useState } from "react";

export default function FamilyInputForm({ onBack }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Campos del formulario
    const [familyType, setFamilyType] = useState("standard");
    const [dateOfEntry, setDateOfEntry] = useState("");
    const [samplePlace, setSamplePlace] = useState("");
    const [radius, setRadius] = useState("");
    const [height, setHeight] = useState("");
    const [classification, setClassification] = useState("");
    const [designResistance, setDesignResistance] = useState(""); // NUEVO

    // Selectores
    const [clients, setClients] = useState([]);
    const [clientSearch, setClientSearch] = useState("");
    const [filteredClients, setFilteredClients] = useState([]);
    const [clientId, setClientId] = useState(null);

    const [projects, setProjects] = useState([]);
    const [projectSearch, setProjectSearch] = useState("");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [projectId, setProjectId] = useState(null);

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

    // Filtrar clientes al escribir
    useEffect(() => {
        const t = clientSearch.toLowerCase();
        setFilteredClients(
            clients.filter(c => c.name.toLowerCase().includes(t))
        );
    }, [clientSearch, clients]);

    // Cuando seleccionan cliente → cargar proyectos
    useEffect(() => {
        if (!clientId) {
            setProjects([]);
            setFilteredProjects([]);
            setProjectId(null);
            return;
        }

        async function loadProjects() {
            try {
                const res = await fetch(`${backendUrl}/clients/${clientId}/projects`);
                if (!res.ok) throw new Error("No se pudieron cargar los proyectos del cliente");

                const data = await res.json();
                setProjects(data);
                setFilteredProjects(data);
            } catch (err) {
                setError(err.message);
            }
        }
        loadProjects();
    }, [clientId, backendUrl]);

    // Filtrar proyectos
    useEffect(() => {
        const t = projectSearch.toLowerCase();
        setFilteredProjects(
            projects.filter(p => p.name.toLowerCase().includes(t))
        );
    }, [projectSearch, projects]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!clientId) return setError("Debe seleccionar un cliente.");
        if (!projectId) return setError("Debe seleccionar un proyecto.");

        try {
            setLoading(true);

            const body = {
                family_type: familyType,
                date_of_entry: dateOfEntry ? new Date(dateOfEntry).toISOString() : null,
                sample_place: samplePlace,
                radius: parseFloat(radius),
                height: parseFloat(height),
                classification: parseInt(classification),
                design_resistance: parseFloat(designResistance), // NUEVO
                client_id: clientId,
                project_id: projectId
            };

            const res = await fetch(`${backendUrl}/families`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Error inesperado");
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

            {/* X para volver */}
            <button
                onClick={onBack}
                className="absolute right-4 top-4 text-gray-600 hover:text-black text-2xl font-bold"
            >
                ×
            </button>

            <h1 className="text-xl font-bold mb-4">Crear Familia</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow max-w-md"
            >

                {/* Tipo de familia */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Tipo de familia</span>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={familyType}
                        onChange={(e) => setFamilyType(e.target.value)}
                    />
                </label>

                {/* Fecha */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Fecha de ingreso</span>
                    <input
                        type="date"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={dateOfEntry}
                        onChange={(e) => setDateOfEntry(e.target.value)}
                    />
                </label>

                {/* Sample place */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Lugar de muestreo</span>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={samplePlace}
                        onChange={(e) => setSamplePlace(e.target.value)}
                    />
                </label>

                {/* Radius */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Radio (cm)</span>
                    <input
                        type="number"
                        step="0.1"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                    />
                </label>

                {/* Height */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Altura (cm)</span>
                    <input
                        type="number"
                        step="0.1"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </label>

                {/* Classification */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Clasificación</span>
                    <input
                        type="number"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={classification}
                        onChange={(e) => setClassification(e.target.value)}
                    />
                </label>

                {/* Diseño: Resistencia */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Resistencia de diseño (MPa)</span>
                    <input
                        type="number"
                        step="0.1"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={designResistance}
                        onChange={(e) => setDesignResistance(e.target.value)}
                    />
                </label>

                {/* SELECTOR DE CLIENTE BUSCABLE */}
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
                        {filteredClients.map(c => (
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
                        ))}
                    </div>
                </label>

                {/* SELECTOR DE PROYECTO BUSCABLE */}
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Proyecto</span>

                    <input
                        type="text"
                        placeholder="Buscar proyecto…"
                        className="mt-1 w-full border rounded-lg px-3 py-2"
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        disabled={!clientId}
                    />

                    {clientId && (
                        <div className="border rounded-lg mt-2 max-h-40 overflow-y-auto bg-white">
                            {filteredProjects.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        setProjectId(p.id);
                                        setProjectSearch(p.name);
                                    }}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                        projectId === p.id ? "bg-blue-100" : ""
                                    }`}
                                >
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    )}
                </label>

                {/* BOTONES */}
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
