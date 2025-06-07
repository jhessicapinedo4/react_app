import React, { useState } from "react";

const CitaCalendar = ({ citas, onDateSelect, onCitaClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior para completar la primera semana
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date: date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Días del siguiente mes para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas × 7 días
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  // Obtener citas para una fecha específica
  const getCitasForDate = (date) => {
    return citas.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      return citaDate.toDateString() === date.toDateString();
    });
  };

  // Navegar entre meses
  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Ir a hoy
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header del calendario */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day, index) => {
          const citasForDay = getCitasForDate(day.date);
          const hasMultipleCitas = citasForDay.length > 1;

          return (
            <div
              key={index}
              onClick={() => onDateSelect && onDateSelect(day.date)}
              className={`min-h-[100px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                !day.isCurrentMonth ? "bg-gray-25 text-gray-400" : ""
              } ${day.isToday ? "bg-blue-50" : ""}`}
            >
              {/* Número del día */}
              <div
                className={`text-sm font-medium mb-1 ${
                  day.isToday
                    ? "w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center"
                    : ""
                }`}
              >
                {day.date.getDate()}
              </div>

              {/* Citas del día */}
              <div className="space-y-1">
                {citasForDay.slice(0, 3).map((cita, citaIndex) => {
                  const time = new Date(cita.fecha).toLocaleTimeString(
                    "es-ES",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <div
                      key={cita.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCitaClick && onCitaClick(cita);
                      }}
                      className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate hover:bg-purple-200 transition-colors"
                      title={`${time} - ${cita.paciente?.nombre} con Dr. ${cita.doctor?.nombre}`}
                    >
                      <div className="font-medium">{time}</div>
                      <div className="truncate">{cita.paciente?.nombre}</div>
                    </div>
                  );
                })}

                {/* Indicador de más citas */}
                {citasForDay.length > 3 && (
                  <div className="text-xs text-gray-600 font-medium">
                    +{citasForDay.length - 3} más
                  </div>
                )}
              </div>

              {/* Indicador de múltiples citas */}
              {hasMultipleCitas && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-gray-600">Hoy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-100 rounded mr-2"></div>
            <span className="text-gray-600">Citas programadas</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Múltiples citas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitaCalendar;
