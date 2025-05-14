import OptionSelector from './OptionSelector';

export default function AttributeBlock({ attribute, selectedOptions, singleCompatibilityRules, handleSelect }) {
  
  const calculateFinalPrice = (option) => {
    let final = option.price;

    // Aplica ajustos segons regles de dependència
    //Si existeix una opcio seleccionada que és igual a la sourceOption de la regla
    // i la regla és de tipus price_modifier, i l
    option.rules?.filter(r => r.ruleType === 'price_modifier' && r.targetOption.id == option.id)?.forEach(rule => {
      const dependencyAttr = Object.values(selectedOptions).find(
        selected => selected.id === rule.sourceOption.id
      );
      if (dependencyAttr) {
        if (rule.operation === 'add') {
          final += rule.value;
        } else if (rule.operation === 'multiply') {
          final *= rule.value;
        }
      }

    });

    return final;
  };

  

  return (
    <div className="mb-4">
      <h3 className="font-medium">{attribute.name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {attribute.itemPartAttributeOptions.map(option => {
          const isSelected = selectedOptions[attribute.id]?.id === option.id;
          
          //Gestió d'Incompatibilitats
          const selectedIds = new Set(Object.values(selectedOptions).map(opt => opt.id));
          
          // Mirem si la opció és incompatible amb alguna altra seleccionada
          const isIncompatible = (option.rules || []).some(rule => {
            if (rule.ruleType === 'incompatibility') {
              return rule.reciprocal
                ? selectedIds.has(rule.sourceOption?.id) || selectedIds.has(rule.targetOption?.id)
                : selectedIds.has(rule.sourceOption?.id);
            }
          });

          // Mirem si està activada una regla de compatibilitat única que inhabilita la opció
          const isBlockedByCompatibility = 
            singleCompatibilityRules &&
            singleCompatibilityRules[attribute.id] &&
            singleCompatibilityRules[attribute.id] !== option.id;

          const isDisabled = isIncompatible || isBlockedByCompatibility;
          
          const finalPrice = calculateFinalPrice(option);


          return (
            <OptionSelector
              key={option.id}
              option={option}
              isSelected={isSelected}
              isDisabled={isDisabled}
              finalPrice={finalPrice}
              /* onClick={() =>
                !isIncompatible && handleSelect(attribute.id, option)
              } */
              onClick={() => handleSelect(attribute.id, option)}
            />
          );
        })}
      </div>
    </div>
  );
}
