import AttributeBlock from './AttributeBlock';

export default function PartSection({ part, level, selectedOptions, singleCompatibilityRules, handleSelect }) {
  const indent = `ml-${level * 4}`;

  const parentClasses = level
    ? 'text-md text-gray-600'
    : 'text-xl font-semibold text-indigo-800';
  const containerClasses = level
    ? 'bg-white p-4 rounded-lg'
    : 'bg-white p-4 rounded-lg shadow-lg';

  return (
    <div className={`mb-6 ${indent} ${containerClasses}`}>      
      <div className="mb-4">
        <span className={parentClasses}>{part.name}</span>
        <span className="text-xs text-gray-600 mb-3 ml-2">{part.description}</span>
      </div>

      {/* Mostra els atributs */}
      {part.itemPartAttributes.map(attr => (
        <AttributeBlock 
          key={attr.id} 
          attribute={attr} 
          selectedOptions={selectedOptions}
          handleSelect={handleSelect}
          singleCompatibilityRules={singleCompatibilityRules}
        />
      ))}

      {/* Subparts */}
      {part.children?.map(child => (
        <PartSection 
          key={child.id} 
          part={child} 
          level={level + 1}  
          selectedOptions={selectedOptions}
          handleSelect={handleSelect}
          singlecCompatibilityRules={singleCompatibilityRules}
        />
      ))}
    </div>
  );
}
