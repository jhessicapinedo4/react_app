import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorCard = ({ doctor, onEdit, onDelete, onViewCitas }) => {
  const [citasCount, setCitasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCitasCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/citas/?doctor=${doctor.id}`
        );
        setCitasCount(response.data.length);
      } catch (err) {
        console.error("Error al obtener el conteo de citas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitasCount();
  }, [doctor.id]);

  // Usamos directamente la URL proporcionada por la API
  const imageUrl = doctor.image || null;

  console.log("Doctor:", doctor.nombre, "URL de la imagen:", imageUrl); // Para depuración

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Header con foto */}
      <div className="relative h-40 bg-gradient-to-br from-blue-400 to-blue-600">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`Foto de Dr. ${doctor.nombre}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Error al cargar la imagen:", e);
              setImageError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Badge de especialidad */}
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-90 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full shadow">
            {doctor.especialidad
              ? doctor.especialidad.nombre
              : "Sin especialidad"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Información principal */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Dr. {doctor.nombre}
          </h3>

          {/* Especialidad */}
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <span className="font-medium">
              {doctor.especialidad
                ? doctor.especialidad.nombre
                : "No especificada"}
            </span>
          </div>

          {/* Teléfono */}
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{doctor.telefono || "No disponible"}</span>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="flex justify-between items-center text-sm mb-4">
          <div className="text-center">
            <div className="font-semibold text-gray-800">ID</div>
            <div className="text-gray-600">#{doctor.id}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">Citas</div>
            <div className="text-blue-600 font-bold">
              {loading ? (
                <span className="inline-block w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></span>
              ) : (
                citasCount
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">Estado</div>
            <div className="text-blue-600 font-medium">Activo</div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewCitas && onViewCitas(doctor)}
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
            onClick={() => onEdit && onEdit(doctor)}
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
            onClick={() => onDelete && onDelete(doctor)}
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

export default DoctorCard;
