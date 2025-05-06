// src/pages/ConfigureItem.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ITEM_DETAILS } from '../graphql/queries';

const ConfigureItem = () => {
  const { itemId } = useParams();
  const { loading, error, data } = useQuery(GET_ITEM_DETAILS, {
    variables: { id: itemId },
  });

  const [selectedOptions, setSelectedOptions] = useState({});

  if (loading) return <p>Carregant...</p>;
  if (error) return <p>Error carregant les parts del producte</p>;

  const item = data.item;

  const handleSelect = (partId, attribute) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [partId]: attribute,
    }));
  };

  const totalPrice = Object.values(selectedOptions).reduce(
    (acc, attr) => acc + attr.price,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Configura: {item.name}</h1>
      <p className="mb-6 text-gray-600">{item.description}</p>

      {item.itemParts.map((part) => (
        <div key={part.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{part.name}</h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">            
            {part.partAttributes.map((attribute) => {
              const isSelected = selectedOptions[part.id]?.id === attribute.id; 
              return (
                <button
                  key={attribute.id}
                  onClick={() => handleSelect(part.id, attribute)}
                  className={`border p-3 rounded text-left transition
                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-100'}`}
                >
                  <div className="font-medium">{attribute.name}</div>
                  <div className="text-sm text-gray-600">{attribute.price} €</div>
                </button>
              );
            }
            )}
        </div>
      </div>
      ))}
      <div className="mt-8 p-4 border-t text-xl font-semibold text-right">
        Preu total: {totalPrice.toFixed(2)} €
      </div>
    </div>
  );
};

export default ConfigureItem;
