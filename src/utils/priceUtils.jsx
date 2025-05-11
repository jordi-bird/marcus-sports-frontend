export default function getAdjustedPrice(option, selectedOptions) {
    let finalPrice = option.price;
  
    option.rules?.filter(r => r.ruleType === 'price_modifier' && r.targetOption.id === option.id)?.forEach(rule => {
      const dependencyAttr = Object.values(selectedOptions).find(
        selected => selected.id === rule.sourceOption.id
      );
      if (dependencyAttr) {
        if (rule.operation === 'add') {
          finalPrice += rule.value;
        } else if (rule.operation === 'multiply') {
          finalPrice *= rule.value;
        }
      }
    });
  
    return finalPrice;
  }
  