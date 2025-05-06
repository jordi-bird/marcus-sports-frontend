import React from 'react';

function ItemCustomizer({ parts }) {
  return (
    <div>
      <h2>Customize your bike</h2>
      {parts.map(part => (
        <div key={part.id}>
          <h3>{part.name}</h3>
          <select>
            {part.partAttributes.map(attribute => (
              <option key={attribute.id}>
                {attribute.name} - €{attribute.price}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default ItemCustomizer;
