import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorCard = ({ doctor, onEdit, onDelete, onViewCitas }) => {
  const [citasCount, setCitasCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitasCount = async () => {
      try {
        const response = await axios.get(`/api/citas/?doctor=${doctor.id}`);

        setCitasCount(response.data.length);
      } catch (err) {
        console.error("Error al obtener el conteo de citas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitasCount();
  }, [doctor.id]);

  // URL base para las imágenes (ajusta según tu configuración)
  const imageUrl = doctor.image
    ? `https://react1.pythonanywhere.com/media/images/${
        doctor.image.split("/images/")[1]
      }`
    : null;
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Header con imagen */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={doctor.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback avatar */}
        <div
          className={`${
            imageUrl ? "hidden" : "flex"
          } absolute inset-0 items-center justify-center`}
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Badge de especialidad */}
        <div className="absolute top-4 right-4">
          <span className="bg-white bg-opacity-90 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full shadow">
            {doctor.especialidad?.nombre || "Sin especialidad"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Información principal */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            Dr. {doctor.nombre}
          </h3>
          <p className="text-blue-600 font-medium text-sm mb-2">
            {doctor.especialidad?.nombre || "Especialidad no asignada"}
          </p>

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

          <p className="text-gray-600">
            <span className="font-medium">Citas programadas:</span>{" "}
            {loading ? (
              <span className="inline-block w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></span>
            ) : (
              citasCount
            )}
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-800">ID</div>
              <div className="text-gray-600">#{doctor.id}</div>
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
            onClick={() => onViewCitas && onViewCitas(doctor)}
            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-1"
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
            Citas
          </button>

          <button
            onClick={() => onEdit && onEdit(doctor)}
            className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors duration-200"
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
