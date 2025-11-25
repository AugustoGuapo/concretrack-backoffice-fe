import { useEffect, useState } from "react";

export default function MemberInputForm({ onBack }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [families, setFamilies] = useState([]);

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");

  const [members, setMembers] = useState([
    { fracture_days: "", date_of_fracture: "" },
    { fracture_days: "", date_of_fracture: "" },
  ]);

  const [error, setError] = useState("");

  // -------------------------
  // Fecha base para calcular date_of_fracture
  // -------------------------
  const [baseDate, setBaseDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // YYYY-MM-DD

  const calculateDate = (days) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + Number(days));
    return d.toISOString();
  };

  const updateMember = (i, field, value) => {
    const next = [...members];
    next[i][field] = value;

    if (field === "fracture_days" && value !== "") {
      next[i].date_of_fracture = calculateDate(value);
    }

    setMembers(next);
  };

  const addMember = () => {
    setMembers([...members, { fracture_days: "", date_of_fracture: "" }]);
  };

  // -------------------------
  // Load clients
  // -------------------------
  useEffect(() => {
    fetch(`${backendUrl}/clients`)
      .then((r) => r.json())
      .then(setClients)
      .catch(() => setError("No se pudieron cargar los clientes"));
  }, []);

  // -------------------------
  // Load projects by client
  // -------------------------
  useEffect(() => {
    if (!selectedClient) return;

    fetch(`${backendUrl}/clients/${selectedClient}/projects`)
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
        setFamilies([]);
        setSelectedProject("");
        setSelectedFamily("");
      })
      .catch(() => setError("No se pudieron cargar los proyectos"));
  }, [selectedClient]);

  // -------------------------
  // Extract families from project
  // -------------------------
  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);

    const proj = projects.find((p) => p.id == projectId);
    if (proj && proj.families) {
      const mappedFamilies = proj.families.map((f) => ({
        ...f,
        name: f.sample_place,
      }));
      setFamilies(mappedFamilies);
    } else {
      setFamilies([]);
    }

    setSelectedFamily("");
  };

  // -------------------------
  // Submit
  // -------------------------
  const handleSave = () => {
    if (!selectedFamily) {
      setError("Debes seleccionar una familia");
      return;
    }

    const payload = members.map((m) => ({
      family_id: Number(selectedFamily),
      fracture_days: Number(m.fracture_days),
      date_of_fracture: m.date_of_fracture,
    }));

    fetch(`${backendUrl}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        onBack();
      })
      .catch(() => setError("No se pudieron crear los miembros"));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Agregar Miembros</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>
      )}

      {/* Fecha base */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Fecha de toma de muestras</label>
        <input
          type="date"
          className="border p-1"
          value={baseDate}
          onChange={(e) => setBaseDate(e.target.value)}
        />
      </div>

      {/* CLIENT */}
      <SearchSelect
        label="Cliente"
        value={selectedClient}
        onChange={setSelectedClient}
        options={clients}
      />

      {/* PROJECT */}
      {selectedClient !== "" && (
        <SearchSelect
          label="Proyecto"
          value={selectedProject}
          onChange={handleProjectSelect}
          options={projects}
        />
      )}

      {/* FAMILY */}
      {selectedProject !== "" && (
        <SearchSelect
          label="Familia"
          value={selectedFamily}
          onChange={setSelectedFamily}
          options={families}
        />
      )}

      {/* MEMBERS */}
      {selectedFamily !== "" && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Miembros</h3>

          {members.map((m, i) => (
            <div key={i} className="border p-3 rounded mb-3 bg-gray-50">
              <label className="block mb-1">Días después de la toma</label>
              <input
                type="number"
                className="border p-1 w-full"
                value={m.fracture_days}
                onChange={(e) =>
                  updateMember(i, "fracture_days", e.target.value)
                }
              />

              <label className="block mt-2 mb-1">Fecha de Fractura (auto)</label>
              <input
                type="text"
                className="border p-1 w-full bg-gray-200"
                readOnly
                value={m.date_of_fracture}
              />
            </div>
          ))}

          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={addMember}
          >
            + Agregar otro miembro
          </button>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Guardar
        </button>

        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={onBack}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* -------------------------
   Searchable Select
------------------------- */
function SearchSelect({ label, value, onChange, options }) {
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-3">
      <label className="block mb-1">{label}</label>

      {/* input buscable */}
      <input
        type="text"
        placeholder="Buscar…"
        className="border p-1 mb-1 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* select */}
      <select
        className="border p-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Seleccione…</option>
        {filtered.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
