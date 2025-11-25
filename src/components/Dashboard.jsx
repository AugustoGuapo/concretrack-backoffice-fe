import { useState, useEffect } from "react";

export default function Dashboard({ onNavigate }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const PAGE_SIZE = 20;

    const [projects, setProjects] = useState([]);
       const [page, setPage] = useState(1);
    const [nextExists, setNextExists] = useState(true);

    const [expanded, setExpanded] = useState(null);

    const translateType = (t) => {
        switch (t) {
            case "accelerated": return "Acelerada";
            case "standard": return "Estándar";
            default: return t;
        }
    };

    useEffect(() => {
        let isMounted = true;

        async function loadPageData() {
            const res = await fetch(`${backendUrl}/projects?page=${page}`);
            const data = await res.json();
            if (!isMounted) return;
            setProjects(data);

            const nextRes = await fetch(`${backendUrl}/projects?page=${page + 1}`);
            const nextData = await nextRes.json();
            if (!isMounted) return;
            setNextExists(nextData.length > 0);
        }

        loadPageData();
        return () => { isMounted = false; };
    }, [page]);

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    async function handleGenerateReport(projectId, familyId) {
        try {
            const res = await fetch(`${backendUrl}/projects/${projectId}/families/${familyId}/report`);

            if (!res.ok) throw new Error("No se pudo descargar el reporte");

            const disposition = res.headers.get("Content-Disposition");
            let filename = "reporte.pdf";
            console.log(JSON.stringify(res.headers));

            if (disposition) {
                const filenameMatch = disposition.match(/filename=([^;]+)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].trim().replace(/["']/g, "");
                }
            }

            console.log("Filename detectado:", filename);

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="p-6">

            {/* ⭐⭐⭐ BOTONERA SUPERIOR — ÚNICO CAMBIO A TU ARCHIVO ⭐⭐⭐ */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => onNavigate("form-client")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Registrar Cliente
                </button>

                <button
                    onClick={() => onNavigate("form-project")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Registrar Proyecto
                </button>

                <button
                    onClick={() => onNavigate("form-family")}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    Registrar Familia
                </button>

                <button
                    onClick={() => onNavigate("form-members")}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                    Registrar Miembros
                </button>
            </div>
            {/* ⭐⭐⭐ FIN DEL CAMBIO ⭐⭐⭐ */}

            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="overflow-x-auto rounded-xl shadow">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Proyecto</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Familias</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map(p => (
                            <>
                                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-3 text-sm text-gray-800">{p.client?.name}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{p.name}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">
                                        {p.families?.length ?? 0}
                                    </td>

                                    <td className="px-6 py-3 text-sm text-right">
                                        <button
                                            onClick={() => toggleExpand(p.id)}
                                            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                                        >
                                            {expanded === p.id ? "Ocultar" : "Ver familias"}
                                        </button>
                                    </td>
                                </tr>

                                {expanded === p.id && (
                                    <tr className="bg-gray-50 border-b">
                                        <td colSpan="4" className="px-6 py-4">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white border rounded-lg shadow">
                                                    <thead>
                                                        <tr className="bg-gray-100 text-sm">
                                                            <th className="px-4 py-2 text-left text-gray-700">Tipo</th>
                                                            <th className="px-4 py-2 text-left text-gray-700">Fecha de ingreso</th>
                                                            <th className="px-4 py-2 text-left text-gray-700">Radio</th>
                                                            <th className="px-4 py-2 text-left text-gray-700">Altura</th>
                                                            <th className="px-4 py-2 text-left text-gray-700">Miembros</th>
                                                            <th className="px-4 py-2"></th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {p.families?.map(f => (
                                                            <tr key={f.id} className="border-b hover:bg-gray-100">
                                                                <td className="px-4 py-2 text-sm">{translateType(f.family_type)}</td>
                                                                <td className="px-4 py-2 text-sm">
                                                                    {new Date(f.date_of_entry).toLocaleDateString("es-CO")}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm">{f.radius}</td>
                                                                <td className="px-4 py-2 text-sm">{f.height}</td>
                                                                <td className="px-4 py-2 text-sm">
                                                                    {Array.isArray(f.members) ? f.members.length : 0}
                                                                </td>

                                                                <td className="px-4 py-2 text-right">
                                                                    <button
                                                                        onClick={() => handleGenerateReport(f.project_id, f.id)}
                                                                        disabled={!f.members}
                                                                        className={`px-3 py-1 rounded-lg text-xs 
                                                                            ${!f.members
                                                                                ? "bg-gray-400 cursor-not-allowed text-white"
                                                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                                            }`}
                                                                    >
                                                                        Generar reporte
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                <button
                    onClick={() => page > 1 && setPage(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg border 
                        ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    Anterior
                </button>

                <span className="text-sm text-gray-700">
                    Página <strong>{page}</strong>
                </span>

                <button
                    onClick={() => nextExists && setPage(page + 1)}
                    disabled={!nextExists}
                    className={`px-4 py-2 rounded-lg border 
                        ${!nextExists ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
