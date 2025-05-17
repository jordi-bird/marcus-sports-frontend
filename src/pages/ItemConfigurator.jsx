import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ITEM } from '../graphql/itemQueries';
import PartSection from '../components/PartSection';
import updateCompatibilityRules from '../utils/selectUtils';
import  getAdjustedPrice from '../utils/priceUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function ItemConfigurator() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const { data, loading } = useQuery(GET_ITEM, {
    variables: { itemId },
  });

  const [selectedOptions, setSelectedOptions] = useState({});
  const [singleCompatibilityRules, setSingleCompatibilityRules] = useState({});
  const [showSummary, setShowSummary] = useState(false);


  const handleSelect = (attributeId, option) => {
    setSelectedOptions(prev => {
      const previousOption = prev[attributeId];
      const updatedSelectedOptions = {
        ...prev,
        [attributeId]: option,
      };
      // Actualitza les regles de compatibilitat
      const updatedRules = updateCompatibilityRules(option, previousOption, parts, singleCompatibilityRules);
      setSingleCompatibilityRules(updatedRules);
      return updatedSelectedOptions
      
    });
  };

  if (loading) return <p>Carregant...</p>;

  const totalPrice = Object.values(selectedOptions).reduce((acc, option) => {
    return acc + getAdjustedPrice(option, selectedOptions);
  }, 0);

  const parts = data.item.itemParts;

  //validació per mostrar parts, considerant les children
  const isPartAndChildrenComplete = (part) => {
    const attributesComplete = part.itemPartAttributes.every(attr => selectedOptions[attr.id]);
    const childrenComplete = part.children?.every(child => isPartAndChildrenComplete(child)) ?? true;
    return attributesComplete && childrenComplete;
  };

  // validació per mostrar botó de compra
  const allAttributes = parts.flatMap(part =>
    part.itemPartAttributes
  );
  
  const isConfigurationComplete = allAttributes.every(attr => selectedOptions[attr.id]);
  
  const optionIdToAttributeId = {};

  parts.forEach(part => {
    part.itemPartAttributes.forEach(attr => {
      attr.itemPartAttributeOptions.forEach(option => {
        optionIdToAttributeId[option.id] = attr.id;
      });
    });
  });

  const handleCheckout = () => {
    localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
    navigate('/checkout');
  };  


  return (
    <div className="p-6">
      <div className="border-b-4 text-white p-2 pb-4 mb-4">
        <Link 
            to={`/`}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
        >
        ← Torna enrere
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Configura: {data.item.name}</h1>
      {parts.map((part, index) => {
        const previousPart = parts[index - 1];
        
        const previousIsComplete = previousPart
          ? isPartAndChildrenComplete(previousPart)
          : true;
        
        const canShow = index === 0 || previousIsComplete;

        return canShow ? (
          <PartSection 
            key={part.id} 
            part={part} 
            selectedOptions={selectedOptions}
            handleSelect={handleSelect}
            singleCompatibilityRules={singleCompatibilityRules}
            level={0}
            optionIdToAttributeId={optionIdToAttributeId}
          />
        ) : null;
      })}
      <div className="h-64"/>
      <div className="fixed bottom-0 left-0 right-0 bg-white  p-4 text-sm shadow-lg border-t-4 border-indigo-200 ">
        <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg">Checkout</h3>
        <button
            onClick={() => setShowSummary(prev => !prev)}
            className="text-blue-600 text-sm ml-4 mt-1"
            title={showSummary ? 'Amaga seleccions' : 'Mostra seleccions'}
          >
            <FontAwesomeIcon icon={showSummary ? faChevronDown : faChevronUp} size="lg" />
          </button>
        </div>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {showSummary && (
              <ul className="text-gray-700 max-h-48 overflow-y-auto border-t pt-2 text-sm">
                {Object.entries(selectedOptions).map(([attrId, option]) => {
                  const adjustedPrice = getAdjustedPrice(option, selectedOptions);
                  const hasOverride = adjustedPrice !== option.price;

                  return (
                    <li key={attrId} className="flex justify-between border-b py-1">
                      <span>{option.name}</span>
                      <span>
                        {hasOverride ? (
                          <>
                            <span className="line-through text-gray-400 mr-1">{option.price.toFixed(2)} €</span>
                            <span className="text-gray-800 font-semibold">{adjustedPrice.toFixed(2)} €</span>
                          </>
                        ) : (
                          <span>{option.price.toFixed(2)} €</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex flex-col items-end mt-2">
              <p className="text-lg font-semibold">Preu total: {totalPrice.toFixed(2)} €</p>
              {isConfigurationComplete && totalPrice > 0 && (
                <button
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                  onClick={handleCheckout}
                >
                  Comprar <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                </button>
              )}
            </div>

          </div>

          
        </div>
      </div>
    </div>
  );
}
