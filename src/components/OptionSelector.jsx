//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export default function OptionSelector({
  option,
  isSelected,
  incompatibleWith,
  finalPrice,
  onClick
}) {
  const hasOverride = finalPrice !== undefined && finalPrice !== option.price;
  
  return (
    <div className="relative w-full">
      <button
        onClick={onClick}
        className={`border p-3 rounded text-left transition w-full
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-100'}
          ${incompatibleWith.length ? 'cursor-not-allowed opacity-50' : ''} 
        `}
        disabled={incompatibleWith.length > 0}
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

      {/* Comprovació per mostrar totes les incompatibilitats amb altres*/}
      {isSelected? (
        option.rules?.length > 0 &&
        <div className="text-xs text-red-500 ml-1 p-2">
        {option.rules
          .filter(rule => rule.ruleType === 'incompatibility')
          .map(rule => {
            const isTarget = rule.targetOption?.id === option.id;
            const otherOption =
              rule.reciprocal && isTarget
                ? rule.sourceOption
                : rule.targetOption;

            // Evita mostrar la mateixa opció com a incompatible amb ella mateixa
            if (!otherOption || otherOption.id === option.id) return null;

            return (
              <p key={`${rule.sourceOption?.id}-${rule.targetOption?.id}`} className="text-right text-xs text-red-500 ml-1 p-1">
                Incompatible amb: <strong>{otherOption.name}</strong>
              </p>
            );
          })}
      </div>
      ):(
      // Quan aquesta opció NO està seleccionada, però hi ha incompatibilitats que la bloquegen
        incompatibleWith?.length > 0 && (
          <div className="text-xs text-red-500 ml-1 p-2">
            {incompatibleWith
              .filter(incompatibleOption => incompatibleOption.id !== option.id)
              .map(incompatibleOption => (
                <p key={incompatibleOption.id} className="text-right">
                  Incompatible amb: <strong>{incompatibleOption.name}</strong>
                </p>
              ))}
          </div>
        )
      )
      }
      </div>
    )
  }
