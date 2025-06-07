import React, { useState, useEffect } from "react";
import axios from "axios";
import EspecialidadCard from "./EspecialidadCard";
import EspecialidadForm from "./EspecialidadForm";
import EspecialidadDetalle from "./EspecialidadDetalle";

const EspecialidadesList = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  // Configuración base de axios
  useEffect(() => {
    axios.defaults.baseURL =
      "https://react1.pythonanywhere.com";
  }, []);

  // Cargar especialidades
  const fetchEspecialidades = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching especialidades...");
      const response = await axios.get(
        "/api/especialidades/"
      );
      console.log("Response:", response.data);
      setEspecialidades(response.data);
    } catch (err) {
      console.error("Error al cargar especialidades:", err);
      setError(
        "Error al cargar las especialidades. " +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  // Manejar creación/edición
  const handleSave = async () => {
    try {
      await fetchEspecialidades();
      setShowForm(false);
      setSelectedEspecialidad(null);
    } catch (err) {
      console.error("Error después de guardar:", err);
      setError("Error al actualizar la lista de especialidades.");
    }
  };

  // Manejar eliminación
  const handleDelete = async (especialidad) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta especialidad?")
    ) {
      try {
        setError("");
        await axios.delete(`/api/especialidades/${especialidad.id}/`);
        await fetchEspecialidades();
      } catch (err) {
        console.error("Error al eliminar:", err);
        setError(
          "Error al eliminar la especialidad. " +
            (err.response?.data?.detail || err.message)
        );
      }
    }
  };

  // Manejar vista de detalles
  const handleView = (especialidad) => {
    setSelectedEspecialidad(especialidad);
    setShowDetalle(true);
  };

  // Manejar edición
  const handleEdit = (especialidad) => {
    setSelectedEspecialidad(especialidad);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Especialidades</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nueva Especialidad
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Grid de especialidades */}
      {especialidades.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay especialidades registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {especialidades.map((especialidad) => (
            <EspecialidadCard
              key={especialidad.id}
              especialidad={especialidad}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <EspecialidadForm
          especialidad={selectedEspecialidad}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedEspecialidad(null);
          }}
        />
      )}

      {/* Modal de detalles */}
      {showDetalle && (
        <EspecialidadDetalle
          especialidad={selectedEspecialidad}
          onClose={() => {
            setShowDetalle(false);
            setSelectedEspecialidad(null);
          }}
        />
      )}
    </div>
  );
};

export default EspecialidadesList;
