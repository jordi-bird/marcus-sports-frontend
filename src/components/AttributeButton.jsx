// components/AttributeButton.jsx
import React from "react";

const AttributeButton = ({ attribute, isSelected, isIncompatible, onClick, incompatibleWith }) => {
  return (
    <div className="relative w-full">
      <button
        onClick={onClick}
        disabled={isIncompatible}
        className={`border p-3 rounded text-left transition w-full
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-100'}
          ${isIncompatible ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <div className="font-medium">{attribute.name}</div>
        <div className="text-sm text-gray-600">{attribute.price} €</div>
      </button>
      {isIncompatible && (
        <p className="text-xs text-right p-2 text-red-500 ml-1">
          Incompatible amb: <strong>{incompatibleWith.name}</strong>
        </p>
      )}
    </div>
  );
};

export default AttributeButton;
