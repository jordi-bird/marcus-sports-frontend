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
    return ( (option.rules || []).map(rule => {
      switch(rule.ruleType){
        case 'incompatibility':
          //Si m'han pogut seleccionar --> no estic deshabilitada
          //Si hi ha una selectedOptions igual a la targetOption o SourceOption de la regla estic deshabilitada
          return (
            <p key={`${option.id}-${rule.id}`} className="text-right text-xs text-red-500 ml-1 p-1">
              Incompatible amb: <strong>{option.id === rule.targetOption.id? rule.sourceOption.name:rule.targetOption.name}</strong>
            </p>
          );
        case 'compatibility':
          return (
            <p key={`${option.id}-${rule.id}`} className="text-right text-xs text-indigo-500 ml-1 p-1">
              Només Compatible amb: <strong>{option.id === rule.targetOption.id? rule.sourceOption.name:rule.targetOption.name}</strong>
            </p>
          );
        case 'price_modifier':
          return (
            <p key={`${option.id}-${rule.id}`} className="text-right text-xs text-blue-500 ml-1 p-1">
              Alertació de preu amb: <strong>{option.id === rule.targetOption.id? rule.sourceOption.name:rule.targetOption.name}</strong>
            </p>
          );
        default:
          return null;
      }
    })
    )
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
        </div>
      </button>

      <div className="mt-1">{renderCompatibilities()}</div>
      </div>
    )
  }
