import React, { useState, useEffect } from "react";
import axios from "axios";

const PacienteCard = ({ paciente, onEdit, onDelete, onViewCitas }) => {
  const [citasCount, setCitasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCitasCount = async () => {
      try {
        const response = await axios.get(
          `https://react1.pythonanywhere.com/api/citas/?paciente=${paciente.id}`
        );
        setCitasCount(response.data.length);
      } catch (err) {
        console.error("Error al obtener el conteo de citas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitasCount();
  }, [paciente.id]);

  // URL base para las imágenes
  const imageUrl = paciente.foto
    ? `https://react1.pythonanywhere.com/media/${
        paciente.foto.split("/media/")[1]
      }`
    : null;

  // Calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
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

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Header con foto */}
      <div className="relative h-40 bg-gradient-to-br from-green-400 to-green-600">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`Foto de ${paciente.nombre}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
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
          </div>
        )}

        {/* Badge de edad */}
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-90 text-green-800 text-xs font-semibold px-2 py-1 rounded-full shadow">
            {calculateAge(paciente.fecha_nacimiento)} años
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Información principal */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {paciente.nombre}
          </h3>

          {/* DNI */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
            <span className="font-medium">
              DNI: {paciente.dni || "No registrado"}
            </span>
          </div>

          {/* Teléfono */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{paciente.telefono || "No disponible"}</span>
          </div>

          {/* Fecha de nacimiento */}
          <div className="flex items-center text-gray-600 text-sm">
            <svg
              className="w-4 h-4 mr-2"
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
            <span>{formatDate(paciente.fecha_nacimiento)}</span>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-800">ID</div>
              <div className="text-gray-600">#{paciente.id}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">Citas</div>
              <div className="text-green-600 font-bold">
                {loading ? (
                  <span className="inline-block w-4 h-4 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></span>
                ) : (
                  citasCount
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">Estado</div>
              <div className="text-green-600 font-medium">Activo</div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onViewCitas && onViewCitas(paciente)}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Ver Historial
          </button>

          <button
            onClick={() => onEdit && onEdit(paciente)}
            className="px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDelete && onDelete(paciente)}
            className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PacienteCard;
