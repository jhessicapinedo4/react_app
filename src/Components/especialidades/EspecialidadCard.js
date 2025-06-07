import React from "react";

const EspecialidadCard = ({ especialidad, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* Header de la card */}
      <div className="flex items-center justify-between mb-4">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {especialidad.nombre}
            </h3>
          </div>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          ID: {especialidad.id}
        </span>
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {especialidad.descripcion || "Sin descripción disponible"}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onView(especialidad)}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Ver
        </button>
        <button
          onClick={() => onEdit(especialidad)}
          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(especialidad)}
          className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default EspecialidadCard;
