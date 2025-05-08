// components/AttributeButton.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const AttributeButton = ({ attribute, isSelected, isIncompatible, onClick, incompatibleWith, finalPrice }) => {
  const hasOverride = finalPrice !== undefined && finalPrice !== attribute.price;

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
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {hasOverride ? (
            <>
              <span className="line-through text-gray-400">{attribute.price.toFixed(2)} €</span>
              <span className="text-gray-600 font-semibold">{finalPrice.toFixed(2)} €</span>
              <FontAwesomeIcon icon={faCircleInfo} title="Preu ajustat per seleccions anteriors" className="text-blue-400" />
            </>
          ) : (
            <span>{attribute.price.toFixed(2)} €</span>
          )}
        </div>
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
