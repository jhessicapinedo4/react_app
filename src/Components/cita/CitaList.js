import React, { useState, useEffect } from "react";
import axios from "axios";
import CitaCard from "./CitaCard";
import LoadingSpinner from "../especialidades/LoadingSpinner";
import ErrorMessage from "../especialidades/ErrorMessage";
import CitaForm from "./CitaForm";

const CitaList = () => {
  const [citas, setCitas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Función para cargar todos los datos
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [
        citasResponse,
        doctoresResponse,
        pacientesResponse,
        especialidadesResponse,
      ] = await Promise.all([
        axios.get("https://react1.pythonanywhere.com/api/citas/"),
        axios.get("https://react1.pythonanywhere.com/api/doctores/"),
        axios.get("https://react1.pythonanywhere.com/api/pacientes/"),
        axios.get("https://react1.pythonanywhere.com/api/especialidades/"),
      ]);

      setCitas(citasResponse.data);
      setDoctores(doctoresResponse.data);
      setPacientes(pacientesResponse.data);
      setEspecialidades(especialidadesResponse.data);
    } catch (error) {
      setError("Error al cargar las citas. Verifica tu conexión.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllData();
  }, []);

  // Función para reintentar la carga
  const handleRetry = () => {
    fetchAllData();
  };

  // Función para abrir formulario de nueva cita
  const handleNewCita = () => {
    setEditingCita(null);
    setShowForm(true);
  };

  // Función para editar cita
  const handleEditCita = (cita) => {
    setEditingCita(cita);
    setShowForm(true);
  };

  // Función para eliminar cita
  const handleDeleteCita = async (cita) => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar la cita del ${new Date(
          cita.fecha
        ).toLocaleDateString()}?`
      )
    ) {
      try {
        await axios.delete(
          `https://react1.pythonanywhere.com/api/citas/${cita.id}/`
        );
        await fetchAllData(); // Recargar la lista
      } catch (error) {
        alert("Error al eliminar la cita");
        console.error("Error:", error);
      }
    }
  };

  // Función para marcar cita como completada
  const handleMarkCompleted = (cita) => {
    alert(`Marcar como completada - Funcionalidad por implementar`);
  };

  // Función para cancelar cita
  const handleCancelCita = (cita) => {
    alert(`Cancelar cita - Funcionalidad por implementar`);
  };

  // Función cuando se guarda una cita
  const handleCitaSaved = () => {
    setShowForm(false);
    setEditingCita(null);
    fetchAllData();
  };

  // Determinar estado de la cita
  const getCitaStatus = (fecha) => {
    const now = new Date();
    const citaDate = new Date(fecha);

    if (citaDate < now) {
      return "completed";
    } else if (citaDate.toDateString() === now.toDateString()) {
      return "today";
    } else {
      return "scheduled";
    }
  };

  // Filtrar citas
  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      cita.paciente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.doctor?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.motivo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      filterDate === "" ||
      new Date(cita.fecha).toDateString() ===
        new Date(filterDate).toDateString();

    const matchesDoctor =
      filterDoctor === "" || cita.doctor?.id?.toString() === filterDoctor;

    let matchesStatus = true;
    if (filterStatus) {
      const status = getCitaStatus(cita.fecha);
      matchesStatus = status === filterStatus;
    }

    return matchesSearch && matchesDate && matchesDoctor && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: citas.length,
    today: citas.filter((c) => getCitaStatus(c.fecha) === "today").length,
    scheduled: citas.filter((c) => getCitaStatus(c.fecha) === "scheduled")
      .length,
    completed: citas.filter((c) => getCitaStatus(c.fecha) === "completed")
      .length,
  };

  // Mostrar loading
  if (loading) {
    return <LoadingSpinner message="Cargando citas médicas..." />;
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Citas Médicas
            </h1>
            <p className="text-gray-600">
              Gestiona las citas y agenda del centro médico
            </p>
          </div>
          <button
            onClick={handleNewCita}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2 w-fit"
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
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm text-gray-600">Total Citas</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Citas Hoy</p>
              <p className="text-2xl font-bold text-gray-800">{stats.today}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Programadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.scheduled}
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Paciente, doctor o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

          {/* Filtro por fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos los doctores</option>
              {doctores.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="today">Hoy</option>
              <option value="scheduled">Programadas</option>
              <option value="completed">Completadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      {filteredCitas.length === 0 ? (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm || filterDate || filterDoctor || filterStatus
              ? "No se encontraron citas"
              : "No hay citas programadas"}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterDate || filterDoctor || filterStatus
              ? "Intenta con otros criterios de búsqueda"
              : "Comienza agendando la primera cita médica"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCitas
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                onEdit={handleEditCita}
                onDelete={handleDeleteCita}
                onMarkCompleted={handleMarkCompleted}
                onCancel={handleCancelCita}
              />
            ))}
        </div>
      )}

      {/* Modal del formulario */}
      {showForm && (
        <CitaForm
          cita={editingCita}
          doctores={doctores}
          pacientes={pacientes}
          especialidades={especialidades}
          onSave={handleCitaSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingCita(null);
          }}
        />
      )}
    </div>
  );
};

export default CitaList;
