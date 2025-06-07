import React from "react";

const CitaCard = ({ cita, onEdit, onDelete, onMarkCompleted, onCancel }) => {
  // Formatear fecha y hora
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "N/A", time: "N/A" };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Determinar estado de la cita
  const getStatus = () => {
    const now = new Date();
    const citaDate = new Date(cita.fecha);

    if (citaDate < now) {
      return {
        label: "Completada",
        color: "green",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
      };
    } else if (citaDate.toDateString() === now.toDateString()) {
      return {
        label: "Hoy",
        color: "blue",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
      };
    } else {
      return {
        label: "Programada",
        color: "yellow",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
      };
    }
  };

  // Determinar color del borde según urgencia
  const getPriorityColor = () => {
    const now = new Date();
    const citaDate = new Date(cita.fecha);
    const timeDiff = citaDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 2 && hoursDiff > 0) {
      return "border-red-300 bg-red-50";
    } else if (hoursDiff < 24 && hoursDiff > 0) {
      return "border-orange-300 bg-orange-50";
    }
    return "border-gray-200 bg-white";
  };

  const { date, time } = formatDateTime(cita.fecha);
  const status = getStatus();

  return (
    <div
      className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-2 ${getPriorityColor()}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
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
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Cita #{cita.id}
              </h3>
              <p className="text-sm text-gray-600">
                {cita.especialidad?.nombre || "Especialidad no especificada"}
              </p>
            </div>
          </div>
          <span
            className={`${status.bgColor} ${status.textColor} text-xs font-semibold px-2 py-1 rounded-full`}
          >
            {status.label}
          </span>
        </div>

        {/* Fecha y hora prominente */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
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
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
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
            <span className="font-medium">{time}</span>
          </div>
        </div>
      </div>

      {/* Información del paciente y doctor */}
      <div className="p-4">
        <div className="space-y-3 mb-4">
          {/* Paciente */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-green-600"
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
            <div>
              <p className="text-sm text-gray-600">Paciente</p>
              <p className="font-medium text-gray-800">
                {cita.paciente?.nombre || "No especificado"}
              </p>
            </div>
          </div>

          {/* Doctor */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-blue-600"
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
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-medium text-gray-800">
                Dr. {cita.doctor?.nombre || "No especificado"}
              </p>
            </div>
          </div>
        </div>

        {/* Motivo */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Motivo de la consulta:</p>
          <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded border">
            {cita.motivo || "No especificado"}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2">
          
          <button
            onClick={() => onEdit && onEdit(cita)}
            className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
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

          {status.label === "Programada" && (
            <button
              onClick={() => onCancel && onCancel(cita)}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            onClick={() => onDelete && onDelete(cita)}
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

export default CitaCard;
