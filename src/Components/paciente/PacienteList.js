import React, { useState, useEffect } from "react";
import axios from "axios";
import PacienteCard from "./PacienteCard";
import PacienteForm from "./PacienteForm";
import PacienteCitas from "./PacienteCitas";
import LoadingSpinner from "../especialidades/LoadingSpinner";
import ErrorMessage from "../especialidades/ErrorMessage";

const PacienteList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [showCitas, setShowCitas] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  // Función para cargar pacientes
  const fetchPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://react1.pythonanywhere.com/api/pacientes/"
      );
      setPacientes(response.data);
    } catch (error) {
      setError("Error al cargar los pacientes. Verifica tu conexión.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar pacientes al montar el componente
  useEffect(() => {
    fetchPacientes();
  }, []);

  // Función para reintentar la carga
  const handleRetry = () => {
    fetchPacientes();
  };

  // Función para abrir formulario de nuevo paciente
  const handleNewPaciente = () => {
    setEditingPaciente(null);
    setShowForm(true);
  };

  // Función para editar paciente
  const handleEditPaciente = (paciente) => {
    setEditingPaciente(paciente);
    setShowForm(true);
  };

  // Función para eliminar paciente
  const handleDeletePaciente = async (paciente) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${paciente.nombre}?`)) {
      try {
        await axios.delete(
          `https://react1.pythonanywhere.com/api/pacientes/${paciente.id}/`
        );
        await fetchPacientes(); // Recargar la lista
      } catch (error) {
        alert("Error al eliminar el paciente");
        console.error("Error:", error);
      }
    }
  };

  // Función para ver citas del paciente
  const handleViewCitas = (paciente) => {
    setSelectedPaciente(paciente);
    setShowCitas(true);
  };

  // Función cuando se guarda un paciente
  const handlePacienteSaved = () => {
    setShowForm(false);
    setEditingPaciente(null);
    fetchPacientes();
  };

  // Calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filtrar pacientes
  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch = paciente.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const age = calculateAge(paciente.fecha_nacimiento);
    const matchesAge =
      filterAge === "" ||
      (filterAge === "0-18" && age < 18) ||
      (filterAge === "19-30" && age >= 19 && age <= 30) ||
      (filterAge === "31-50" && age >= 31 && age <= 50) ||
      (filterAge === "51+" && age > 50);
    return matchesSearch && matchesAge;
  });

  // Mostrar loading
  if (loading) {
    return <LoadingSpinner message="Cargando pacientes..." />;
  }

  // Mostrar error
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Listado de Pacientes
        </h1>
        <button
          onClick={handleNewPaciente}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nuevo Paciente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre del paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filtro por edad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de edad
            </label>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todas las edades</option>
              <option value="0-18">0-18 años</option>
              <option value="19-30">19-30 años</option>
              <option value="31-50">31-50 años</option>
              <option value="51+">51+ años</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de pacientes */}
      {filteredPacientes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm || filterAge
              ? "No se encontraron pacientes"
              : "No hay pacientes registrados"}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterAge
              ? "Intenta con otros criterios de búsqueda"
              : "Comienza agregando el primer paciente al sistema"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacientes.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onEdit={handleEditPaciente}
              onDelete={handleDeletePaciente}
              onViewCitas={handleViewCitas}
            />
          ))}
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <PacienteForm
          paciente={editingPaciente}
          onSave={handlePacienteSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingPaciente(null);
          }}
        />
      )}

      {/* Modal de citas */}
      {showCitas && selectedPaciente && (
        <PacienteCitas
          paciente={selectedPaciente}
          onClose={() => {
            setShowCitas(false);
            setSelectedPaciente(null);
          }}
        />
      )}
    </div>
  );
};

export default PacienteList;
