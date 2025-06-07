import React from "react";

const EspecialidadDetalle = ({ especialidad, onClose }) => {
  if (!especialidad) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Detalles de la Especialidad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
            <p className="mt-1 text-lg text-gray-900">{especialidad.nombre}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
            <p className="mt-1 text-lg text-gray-900">
              {especialidad.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EspecialidadDetalle;
