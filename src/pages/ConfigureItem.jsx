import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ITEM_DETAILS } from '../graphql/queries';
import ItemPartGroup from '../components/ItemPartGroup';

const ConfigureItem = () => {
  const { itemId } = useParams();
  const { loading, error, data } = useQuery(GET_ITEM_DETAILS, {
    variables: { id: itemId },
  });

  const [selectedOptions, setSelectedOptions] = useState({});

  const handleSelect = (partId, attribute) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [partId]: attribute,
    }));
  };

  const buildItemPartTree = (parts) => {
    const partMap = {};
    const rootParts = [];

    parts.forEach(part => {
      const newPart = { ...part, children: [] };
      partMap[part.id] = newPart;
    });

    parts.forEach(part => {
      const newPart = partMap[part.id];
      if (part.parent) {
        const parent = partMap[part.parent.id];
        if (parent) parent.children.push(newPart);
      } else {
        rootParts.push(newPart);
      }
    });

    return rootParts;
  };

  if (loading) return <p>Carregant...</p>;
  if (error) return <p>Error carregant les parts del producte</p>;

  const item = data.item;
  const rootParts = buildItemPartTree(item.itemParts);
  const totalPrice = Object.values(selectedOptions).reduce(
    (acc, attr) => acc + attr.price,
    0
  );

  return (
    <div className="p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">Configura: {item.name}</h1>
      <p className="mb-6 text-gray-600">{item.description}</p>
      {rootParts.map(part => (
        <div key={part.id}>
          <ItemPartGroup
            part={part}
            selectedOptions={selectedOptions}
            handleSelect={handleSelect}
          />
          
        </div>
      ))}

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t text-xl font-semibold text-right">
        Preu total: {totalPrice.toFixed(2)} €
      </div>
    </div>
  );
};

export default ConfigureItem;
