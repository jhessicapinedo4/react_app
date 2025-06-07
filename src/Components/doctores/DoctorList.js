import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorCard from "./DoctorCard";
import LoadingSpinner from "../especialidades/LoadingSpinner";
import ErrorMessage from "../especialidades/ErrorMessage";
import DoctorForm from "./DoctorForm";
import DoctorCitas from "./DoctorCitas";

const DoctorList = () => {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEspecialidad, setFilterEspecialidad] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showCitas, setShowCitas] = useState(false);

  // Configuración base de axios
  useEffect(() => {
    axios.defaults.baseURL =
      "https://react1.pythonanywhere.com";
  }, []);

  // Función para cargar doctores
  const fetchDoctores = async () => {
    try {
      setLoading(true);
      setError(null);
      const [doctoresResponse, especialidadesResponse, citasResponse] =
        await Promise.all([
          axios.get("/api/doctores/"),
          axios.get("/api/especialidades/"),
          axios.get("/api/citas/"),
        ]);
      setDoctores(doctoresResponse.data);
      setEspecialidades(especialidadesResponse.data);
      setCitas(citasResponse.data);
    } catch (error) {
      setError("Error al cargar los doctores. Verifica tu conexión.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchDoctores();
  }, []);

  // Función para reintentar la carga
  const handleRetry = () => {
    fetchDoctores();
  };

  // Función para abrir formulario de nuevo doctor
  const handleNewDoctor = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  // Función para editar doctor
  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  // Función para eliminar doctor
  const handleDeleteDoctor = async (doctor) => {
    if (window.confirm(`¿Estás seguro de eliminar al Dr. ${doctor.nombre}?`)) {
      try {
        await axios.delete(`/api/doctores/${doctor.id}/`);
        await fetchDoctores(); // Recargar la lista
      } catch (error) {
        alert("Error al eliminar el doctor");
        console.error("Error:", error);
      }
    }
  };

  // Función para ver citas del doctor
  const handleViewCitas = (doctor) => {
    setSelectedDoctor(doctor);
    setShowCitas(true);
  };

  // Función cuando se guarda un doctor
  const handleDoctorSaved = () => {
    setShowForm(false);
    setEditingDoctor(null);
    fetchDoctores();
  };

  // Filtrar doctores
  const filteredDoctores = doctores.filter((doctor) => {
    const matchesSearch = doctor.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesEspecialidad =
      filterEspecialidad === "" ||
      doctor.especialidad?.id?.toString() === filterEspecialidad;
    return matchesSearch && matchesEspecialidad;
  });

  // Mostrar loading
  if (loading) {
    return <LoadingSpinner message="Cargando doctores..." />;
  }

  // Mostrar error
  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctores</h1>
            <p className="text-gray-600">
              Gestiona el equipo médico del centro
            </p>
          </div>
          <button
            onClick={handleNewDoctor}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
          >
            <svg
              className="w-5 h-5"
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
            <span>Nuevo Doctor</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Doctores</p>
              <p className="text-2xl font-bold text-gray-800">
                {doctores.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Especialidades</p>
              <p className="text-2xl font-bold text-gray-800">
                {especialidades.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Citas Hoy</p>
              <p className="text-2xl font-bold text-gray-800">
                {" "}
                {citas.length}{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Doctor
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Filtro por especialidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Especialidad
            </label>
            <select
              value={filterEspecialidad}
              onChange={(e) => setFilterEspecialidad(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las especialidades</option>
              {especialidades.map((especialidad) => (
                <option key={especialidad.id} value={especialidad.id}>
                  {especialidad.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de doctores */}
      {filteredDoctores.length === 0 ? (
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
            {searchTerm || filterEspecialidad
              ? "No se encontraron doctores"
              : "No hay doctores registrados"}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterEspecialidad
              ? "Intenta con otros criterios de búsqueda"
              : "Comienza agregando el primer doctor al sistema"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctores.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={handleEditDoctor}
              onDelete={handleDeleteDoctor}
              onViewCitas={handleViewCitas}
            />
          ))}
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <DoctorForm
          doctor={editingDoctor}
          especialidades={especialidades}
          onSave={handleDoctorSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingDoctor(null);
          }}
        />
      )}

      {/* Modal de citas */}
      {showCitas && (
        <DoctorCitas
          doctor={selectedDoctor}
          onClose={() => {
            setShowCitas(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorList;
