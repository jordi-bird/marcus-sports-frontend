import { useEffect, useRef } from 'react';
import AttributeBlock from './AttributeBlock';


export default function PartSection({ part, level, selectedOptions, singleCompatibilityRules, handleSelect, optionIdToAttributeId }) {
  const indent = `ml-${level * 4}`;

  const parentClasses = level
    ? 'text-md text-gray-600'
    : 'text-xl font-semibold text-indigo-800';
  const containerClasses = level
    ? 'bg-white p-4 rounded-lg'
    : 'bg-white p-4 rounded-lg shadow-lg';

  const isPartComplete = (part) =>
    part.itemPartAttributes.every(attr => selectedOptions[attr.id]);


  return (
    <div className={`mb-6 ${indent} ${containerClasses}`}>      
      <div className="mb-4">
        <span className={parentClasses}>{part.name}</span>
        <span className="text-xs text-gray-600 mb-3 ml-2">{part.description}</span>
      </div>

      {/* Mostra els atributs */}
      {part.itemPartAttributes.map((attr, index) => {
        const previousAttr = part.itemPartAttributes[index - 1];
        const isFirst = index === 0;
        const previousIsSelected = previousAttr && selectedOptions[previousAttr.id];
        const shouldShow = isFirst || previousIsSelected;

        const ref = useRef();

        useEffect(() => {
          if (shouldShow && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            ref.current.classList.add('fade-in');
          }
        }, [shouldShow]);

        return shouldShow ? (
          <div
            key={attr.id}
            ref={ref}
            className="opacity-0 animate-fadeIn" 
            onAnimationEnd={() => ref.current?.classList.remove('fade-in')}
          >
            <AttributeBlock
              attribute={attr}
              selectedOptions={selectedOptions}
              handleSelect={handleSelect}
              singleCompatibilityRules={singleCompatibilityRules}
              optionIdToAttributeId={optionIdToAttributeId}
            />
          </div>
        ) : null;
      })}

      {/* Subparts */}
      {part.children?.map((child, index) => {
        const canShowChild = isPartComplete(part);
        return canShowChild ? (
          <PartSection 
            key={child.id} 
            part={child} 
            level={level + 1}  
            selectedOptions={selectedOptions}
            handleSelect={handleSelect}
            singleCompatibilityRules={singleCompatibilityRules}
            optionIdToAttributeId={optionIdToAttributeId}
          />
        ) : null;
      })}
    </div>
  );
}
