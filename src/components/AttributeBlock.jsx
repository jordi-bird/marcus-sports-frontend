import OptionSelector from './OptionSelector';

export default function AttributeBlock({ attribute, selectedOptions, singleCompatibilityRules, handleSelect }) {
  
  const calculateFinalPrice = (option) => {
    let final = option.price;

    // Aplica ajustos segons regles de dependència
    option.priceRules?.forEach(rule => {
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
