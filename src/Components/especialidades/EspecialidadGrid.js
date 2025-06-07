
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  User,
  Stethoscope,
  X,
} from "lucide-react";

const EspecialidadGrid = ({ especialidades, onEdit, onDelete, onView }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {especialidades.map((especialidad) => (
        <EspecialidadCard
          key={especialidad.id}
          especialidad={especialidad}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};
