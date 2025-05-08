import React from "react";
import AttributeButton from "./AttributeButton";

const ItemPartGroup = ({ part, selectedOptions, handleSelect }) => {
  const calculateFinalPrice = (attribute) => {
    let final = attribute.price;

    attribute.priceRules?.forEach(rule => {
      const dependencyAttr = Object.values(selectedOptions).find(
        selected => selected.id === rule.dependencyPartAttributeId
      );
      if (dependencyAttr) {
        if (rule.operator === 'add') {
          final += rule.priceAdjustment;
        } else if (rule.operator === 'multiply') {
          final *= rule.priceAdjustment;
        }
      }
    });

    return final;
  };

  const renderPart = (part, level = 0) => {
    const parentClasses = part.parent
      ? 'text-sm text-gray-600'
      : 'text-xl font-semibold text-gray-800';
    const containerClasses = part.parent
      ? 'bg-white p-4 rounded-lg'
      : 'bg-white p-4 rounded-lg shadow-lg';
    const indent = level * 4;

    return (
      <div key={part.id} className={`mb-6 ml-${indent} ${containerClasses}`}>
        <h2 className={`${parentClasses} mb-2`}>
          {part.parent && (
            <i className="fas fa-caret-right mr-2 text-gray-400"></i>
          )}
          {part.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {part.partAttributes.map((attribute) => {
            const isSelected = selectedOptions[part.id]?.id === attribute.id;
            const incompatibleWith = Object.values(selectedOptions).find(selected =>
              attribute.incompatibleAttributes.some(
                incompatible => incompatible.id === selected?.id
              )
            );
            const isIncompatible = !!incompatibleWith;
            const finalPrice = calculateFinalPrice(attribute);

            return (
              <AttributeButton
                key={attribute.id}
                attribute={attribute}
                isSelected={isSelected}
                isIncompatible={isIncompatible}
                incompatibleWith={incompatibleWith}
                finalPrice={finalPrice}
                onClick={() =>
                  !isIncompatible && handleSelect(part.id, attribute)
                }
              />
            );
          })}
        </div>

        {part.children?.length > 0 && (
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
