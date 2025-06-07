import React from "react";

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinner animado */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse"></div>
      </div>

      {/* Mensaje de carga */}
      <p className="mt-4 text-gray-600 font-medium">{message}</p>

      {/* Barra de progreso animada */}
      <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full animate-pulse"
          style={{
            animation: "loading-progress 2s ease-in-out infinite",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
