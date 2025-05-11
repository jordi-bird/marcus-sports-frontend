export default function updateCompatibilityRules(option, previousOption, parts, prevRules) {
    let updatedRules = { ...prevRules };
  
    // Elimina regles de l'opció anterior
    previousOption?.rules?.filter(r => r.ruleType === 'compatibility')?.forEach(rule => {
      const targetAttr = findTargetAttribute(parts, rule.targetOption?.id);
      if (targetAttr && updatedRules[targetAttr.id] === rule.targetOption?.id) {
        delete updatedRules[targetAttr.id];
      }
    });
  
    // Afegeix regles de la nova opció
    option.rules?.filter(r => r.ruleType === 'compatibility')?.forEach(rule => {
      // Només afegim la condició si la opció que ens ve és la source
      // Si la regla fos reciproca, no caldria mirar si és la source
      // però això ens porta a comportaments no desitjats en les seleccions de les opcions 
      // ja que bloquejaria les opcions dels dos atributs i no podriem desfer la selecció
      // ex: if(option.id === rule.sourceOption?.id || rule.reciprocal) {
      if(option.id === rule.sourceOption?.id) {
        const targetAttr = findTargetAttribute(parts, rule.targetOption?.id);
        if (targetAttr) {
          updatedRules[targetAttr.id] = rule.targetOption?.id;
        }
      }
    });
    
    return updatedRules;
  }
  
  function findTargetAttribute(parts, optionId) {
    return parts.flatMap(part => part.itemPartAttributes)
      .find(attr => attr.itemPartAttributeOptions.some(opt => opt.id === optionId));
  }
  