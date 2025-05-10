import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ITEM } from '../graphql/queries';
import PartSection from '../components/PartSection';

export default function ItemConfigurator() {
  const { itemId } = useParams();

  // Aqui passar parametre tipus id: itemId??
  const { data, loading } = useQuery(GET_ITEM, {
    variables: { itemId },
  });

  const [selectedOptions, setSelectedOptions] = useState({});

  const handleSelect = (attributeId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attributeId]: option,
    }));
    console.log(selectedOptions);
  };


  const totalPrice = Object.values(selectedOptions).reduce((acc, attr) => {
    let basePrice = attr.price;

    // Aplica priceRules si cal
    if (attr.priceRules && attr.priceRules.length > 0) {
      attr.priceRules.forEach(rule => {
        const dependencyAttr = Object.values(selectedOptions).find(
          selected => selected.id === rule.dependencyPartAttributeId
        );
        if (dependencyAttr) {
          if (rule.operator === 'add') {
            basePrice += rule.priceAdjustment;
          } else if (rule.operator === 'multiply') {
            basePrice *= rule.priceAdjustment;
          }
        }
      });
    }

    return acc + basePrice;
  }, 0);

  if (loading) return <p>Carregant...</p>;

  const parts = data.item.itemParts;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Configura: {data.item.name}</h1>
      {parts.map(part => (
        <PartSection 
          key={part.id} 
          part={part} 
          selectedOptions={selectedOptions}
          handleSelect={handleSelect}
          level={0}
        />
      ))}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t text-xl font-semibold text-right">
        Preu total: {totalPrice.toFixed(2)} €
      </div>
    </div>
  );
}
