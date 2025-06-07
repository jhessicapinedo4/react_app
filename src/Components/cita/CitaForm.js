import React, { useState, useEffect } from "react";
import axios from "axios";

const CitaForm = ({
  cita,
  doctores,
  pacientes,
  especialidades,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    especialidad: cita?.especialidad?.id || "",
    doctor: cita?.doctor?.id || "",
    paciente: cita?.paciente?.id || "",
    fecha: cita?.fecha ? cita.fecha.slice(0, 16) : "", // formato para datetime-local
    motivo: cita?.motivo || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableDoctors, setAvailableDoctors] = useState([]);

  // Filtrar doctores por especialidad
  useEffect(() => {
    if (formData.especialidad) {
      const filtered = doctores.filter(
        (doctor) =>
          doctor.especialidad?.id?.toString() === formData.especialidad
      );
      setAvailableDoctors(filtered);

      // Si el doctor actual no está en la especialidad seleccionada, resetear
      if (
        formData.doctor &&
        !filtered.find((d) => d.id.toString() === formData.doctor)
      ) {
        setFormData((prev) => ({ ...prev, doctor: "" }));
      }
    } else {
      setAvailableDoctors(doctores);
    }
  }, [formData.especialidad, doctores]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.especialidad) {
      newErrors.especialidad = "La especialidad es obligatoria";
    }

    if (!formData.doctor) {
      newErrors.doctor = "El doctor es obligatorio";
    }

    if (!formData.paciente) {
      newErrors.paciente = "El paciente es obligatorio";
    }

    if (!formData.fecha) {
      newErrors.fecha = "La fecha y hora son obligatorias";
    } else {
      const citaDate = new Date(formData.fecha);
      const now = new Date();

      if (citaDate <= now) {
        newErrors.fecha = "La fecha debe ser futura";
      }

      // Validar horario de atención (8:00 - 18:00)
      const hour = citaDate.getHours();
      if (hour < 8 || hour >= 18) {
        newErrors.fecha = "La cita debe ser entre las 8:00 y 18:00";
      }

      // No permitir citas en domingo
      if (citaDate.getDay() === 0) {
        newErrors.fecha = "No se pueden agendar citas los domingos";
      }
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = "El motivo de la consulta es obligatorio";
    } else if (formData.motivo.trim().length < 10) {
      newErrors.motivo = "El motivo debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        especialidad: parseInt(formData.especialidad),
        doctor: parseInt(formData.doctor),
        paciente: parseInt(formData.paciente),
        fecha: formData.fecha,
        motivo: formData.motivo,
      };

      if (cita) {
        // Actualizar cita existente
        await axios.put(
          `https://react1.pythonanywhere.com/api/citas/${cita.id}/`,
          submitData
        );
      } else {
        // Crear nueva cita
        await axios.post(
          "https://react1.pythonanywhere.com/api/citas/",
          submitData
        );
      }

      onSave();
    } catch (error) {
      console.error("Error al guardar cita:", error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Error al guardar la cita. Inténtalo de nuevo." });
      }
    } finally {
      setLoading(false);
    }
  };

  // Generar horarios disponibles
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {cita ? "Editar Cita" : "Nueva Cita Médica"}
          </h2>
          <button
            onClick={onCancel}
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Especialidad */}
            <div>
              <label
                htmlFor="especialidad"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Especialidad *
              </label>
              <select
                id="especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.especialidad
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Selecciona una especialidad</option>
                {especialidades.map((especialidad) => (
                  <option key={especialidad.id} value={especialidad.id}>
                    {especialidad.nombre}
                  </option>
                ))}
              </select>
              {errors.especialidad && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.especialidad}
                </p>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label
                htmlFor="doctor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Doctor *
              </label>
              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                disabled={!formData.especialidad}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.doctor ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">
                  {!formData.especialidad
                    ? "Primero selecciona una especialidad"
                    : "Selecciona un doctor"}
                </option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.nombre}
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <p className="mt-1 text-sm text-red-600">{errors.doctor}</p>
              )}
            </div>

            {/* Paciente */}
            <div>
              <label
                htmlFor="paciente"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Paciente *
              </label>
              <select
                id="paciente"
                name="paciente"
                value={formData.paciente}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.paciente
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Selecciona un paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nombre} - DNI: {paciente.dni}
                  </option>
                ))}
              </select>
              {errors.paciente && (
                <p className="mt-1 text-sm text-red-600">{errors.paciente}</p>
              )}
            </div>

            {/* Fecha y hora */}
            <div>
              <label
                htmlFor="fecha"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha y Hora *
              </label>
              <input
                type="datetime-local"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                  errors.fecha ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.fecha && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Horario de atención: 8:00 AM - 6:00 PM (Lunes a Sábado)
              </p>
            </div>
          </div>

          {/* Motivo */}
          <div className="mt-6">
            <label
              htmlFor="motivo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Motivo de la Consulta *
            </label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                errors.motivo ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Describe el motivo de la consulta, síntomas o procedimiento requerido..."
            />
            {errors.motivo && (
              <p className="mt-1 text-sm text-red-600">{errors.motivo}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Mínimo 10 caracteres. Sé específico para ayudar al doctor a
              prepararse.
            </p>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Información importante:
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • Las citas deben agendarse con al menos 30 minutos de
                    anticipación
                  </li>
                  <li>
                    • Cancelaciones deben realizarse con 2 horas de anticipación
                    mínimo
                  </li>
                  <li>• El paciente debe llegar 15 minutos antes de su cita</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : cita ? (
                "Actualizar Cita"
              ) : (
                "Agendar Cita"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitaForm;
