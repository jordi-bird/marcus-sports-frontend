import OptionSelector from './OptionSelector';

export default function AttributeBlock({ attribute, selectedOptions, handleSelect }) {
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
          
          const incompatibleWith = Object.values(selectedOptions).filter(selected => {
            return option.rules?.some(rule => {
              return (
                rule.ruleType === 'incompatibility' &&
                (
                  rule.targetOption?.id === selected.id || 
                  (rule.reciprocal && rule.sourceOption?.id === selected.id)
                )
              );
            });
          });
          
          const finalPrice = calculateFinalPrice(option);

          return (
            <OptionSelector
              key={option.id}
              option={option}
              isSelected={isSelected}
              incompatibleWith={incompatibleWith}
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
