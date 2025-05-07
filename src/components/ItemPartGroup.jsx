import React from "react";
import AttributeButton from "./AttributeButton";

const ItemPartGroup = ({ part, selectedOptions, handleSelect }) => {
  // Funció recursiva per representar parts i els seus fills
  const renderPart = (part, level = 0) => {
    // Classes per estilitzar
    const parentClasses = part.parent ? 'text-sm text-gray-600' : 'text-xl font-semibold text-gray-800';
    const containerClasses = part.parent ? 'bg-white  p-4 rounded-lg' : 'bg-white p-4 rounded-lg shadow-lg';
    const indent = level * 4;  // Incrementa l'indentació amb cada nivell de profunditat

    return (
      <div key={part.id} className={`mb-6 ml-${indent} ${containerClasses}`}>
        {/* Títol de la part amb una mida de font condicionada segons si té pare */}
        <h2 className={`${parentClasses} mb-2`}>
            {part.parent && (
                <i className="fas fa-caret-right mr-2 text-gray-400"></i> // Icona per parts fills
            )}
            {part.name}
        </h2>
        {/* Si hi ha fills, es mostraran amb una indentació més gran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">          
            {part.partAttributes.map((attribute) => {
            const isSelected = selectedOptions[part.id]?.id === attribute.id;
            const incompatibleWith = Object.values(selectedOptions).find(selected =>
              attribute.incompatibleAttributes.some(incompatible => incompatible.id === selected?.id)
            );
            const isIncompatible = !!incompatibleWith;

            return (
              <AttributeButton
                key={attribute.id}
                attribute={attribute}
                isSelected={isSelected}
                isIncompatible={isIncompatible}
                incompatibleWith={incompatibleWith}
                onClick={() => !isIncompatible && handleSelect(part.id, attribute)}
              />
            );
          })}
        </div>

        {/* Si té fills, renderitza'ls recursivament amb un nivell més gran */}
        {part.children && part.children.length > 0 && (
          <div className="ml-6">
            {part.children.map((child) => renderPart(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return renderPart(part);
};

export default ItemPartGroup;
