import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import { useState } from 'react';

export default function OptionSelector({
  option,
  isSelected,
  isDisabled,
  finalPrice,
  onClick
}) {
  
  const hasOverride = finalPrice !== undefined && finalPrice !== option.price;

 
  
  const renderCompatibilities = () => {
    return (option.rules || []).flatMap(rule => {
      const baseKey = `${option.id}-${rule.id}`;
  
      switch (rule.ruleType) {
        case 'incompatibility':
          return [
            <p key={`${baseKey}-incompatibility`} className="text-right text-xs text-red-500 ml-1 p-1">
              Incompatible amb: <strong>{option.id === rule.targetOption.id ? rule.sourceOption.name : rule.targetOption.name}</strong>
            </p>
          ];
  
        case 'compatibility': {
          const items = [];
  
          if (option.id === rule.sourceOption.id) {
            items.push(
              <p key={`${baseKey}-source`} className="text-right text-xs text-indigo-500 ml-1 p-1">
                Només compatible amb: <strong>{rule.targetOption.name}</strong>
              </p>
            );
          }
  
          if (option.id === rule.targetOption.id && rule.reciprocal) {
            items.push(
              <p key={`${baseKey}-reciprocal`} className="text-right text-xs text-indigo-500 ml-1 p-1">
                Només compatible amb: <strong>{rule.sourceOption.name}</strong>
              </p>
            );
          }
  
          if (option.id === rule.targetOption.id && !rule.reciprocal) {
            items.push(
              <p key={`${baseKey}-unique`} className="text-right text-xs text-gray-400 ml-1 p-1">
                Única compatible per: <strong>{rule.sourceOption.name}</strong>
              </p>
            );
          }
          
  
          return items;
        }
  
        case 'price_modifier':
          if (option.id === rule.targetOption.id) {
            return [
              <p key={`${baseKey}-price`} className="text-right text-xs text-blue-500 ml-1 p-1">
                Preu Alterat per: <strong>{rule.sourceOption.name }</strong>
              </p>
            ];
          }
          else {
            return [
              <p key={`${baseKey}-price`} className="text-right text-xs text-blue-500 ml-1 p-1">
                Altera el preu de: <strong>{rule.targetOption.name}</strong>{' '}
                ({rule.operation === 'add' ? `+${rule.value}€` : `×${rule.value}€`})
              </p>
            ];
          }
  
        default:
          return [];
      }
    });
  };

  const renderStock = () => {
    if (option.stock === 0) {
      return (
        <p className="text-right text-xs text-red-500 ml-1 p-1">
          Sense stock
        </p>
      );
    }
    else{
      if (option.stock < 5) {
        return (
          <p className="text-right text-xs text-yellow-500 ml-1 p-1">
            Queden {option.stock} unitats
          </p>
        );
      }
      if (option.stock >= 5) {
        return (
          <p className="text-right text-xs text-green-500 ml-1 p-1">
            Stock disponible
          </p>
        );
      }
    }
    return null;
  }


  return (
    <div className="relative w-full">
      <button
        onClick={onClick}
        className={`border p-3 rounded text-left transition w-full
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-100'}
          ${isDisabled ? 'cursor-not-allowed opacity-50' : ''} 
        `}
        disabled={isDisabled}
      >
        <div className="font-medium">{option.name}</div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {hasOverride ? (
            <>
              <span className="line-through text-gray-400">{option.price.toFixed(2)} €</span>
              <span className="text-gray-600 font-semibold">{finalPrice.toFixed(2)} €</span>
              <FontAwesomeIcon
                icon={faCircleInfo}
                title="Preu ajustat per seleccions anteriors"
                className="text-blue-400"
              />
            </>
          ) : (
            <span>{option.price.toFixed(2)} €</span>
          )}
          {renderStock()}
        </div>
      </button>

      <div className="mt-1">{renderCompatibilities()}</div>
      </div>
    )
  }
