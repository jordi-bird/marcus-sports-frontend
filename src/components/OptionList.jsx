import { useState } from 'react';
import OptionForm from './OptionForm';
import Modal from './Modal';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ATTRIBUTE_OPTIONS } from '../graphql/optionQueries';
import { DELETE_OPTION } from '../graphql/optionMutations';

export default function OptionList({ attributeId, item }) {
  
  const { data, loading } = useQuery(GET_ATTRIBUTE_OPTIONS, {
    variables: { itemPartAttributeId: attributeId },
    skip: !attributeId,
  });

  const [deleteOption] = useMutation(DELETE_OPTION, {
    refetchQueries: ['GetItemPartAttributeOptions'], // o el nom exacte del teu query
  });
  

  const [creatingNew, setCreatingNew] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [expandedOptionId, setExpandedOptionId] = useState(null);

  const handleDelete = async (opt) => {
      if (confirm(`Segur que vols eliminar l'opció "${opt.name}"?`)) {
        try {
          await deleteOption({ variables: { id: opt.id } });
        } catch (err) {
          console.error('Error eliminant opció:', err.message);
          alert('Error eliminant opció.');
        }
     }
  }

  if (loading) return <p>Carregant opcions...</p>;
  if (!data?.itemPartAttribute?.itemPartAttributeOptions) return <p>No s'han trobat opcions.</p>;

  const options = data.itemPartAttribute.itemPartAttributeOptions;

  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <div key={opt.id} className="p-2 border rounded bg-white">
          <div className="flex justify-between items-center">
            <span>
              <strong>{opt.name}</strong> - {opt.price}€
            </span>
            <div className="space-x-2">
              <button onClick={() => setEditingOption(opt)} className="text-sm text-green-600">✏️ Edita</button>
              <button onClick={async () => handleDelete(opt)} className="text-sm text-red-600">
                🗑️ Elimina
              </button>
              <button
                onClick={() => setExpandedOptionId(expandedOptionId === opt.id ? null : opt.id)}
                className="text-sm text-green-600"
              >
                {expandedOptionId === opt.id ? '➖ Amaga detalls' : '➕ Detalls'}
              </button>
            </div>
          </div>
          {expandedOptionId === opt.id && !editingOption && (
            <div className="text-sm text-gray-600 mt-1 pl-4">
              <strong>Stock: </strong><span>{opt.stock || 'Sense stock'}</span>
              {(opt.rules || []).map(rule => {
                const baseKey = `${opt.id}-${rule.id}`;

                switch (rule.ruleType) {
                  case 'incompatibility':
                    return (
                      <p key={baseKey} className="text-left text-xs text-red-500">
                        Incompatible amb: <strong>{opt.id === rule.targetOption.id ? rule.sourceOption.name : rule.targetOption.name}</strong>
                      </p>
                    );

                  case 'compatibility': {
                    const items = [];

                    if (opt.id === rule.sourceOption.id) {
                      items.push(
                        <p key={`${baseKey}-source`} className="text-left text-xs text-indigo-500">
                          Només compatible amb: <strong>{rule.targetOption.name}</strong>
                        </p>
                      );
                    }

                    if (opt.id === rule.targetOption.id && rule.reciprocal) {
                      items.push(
                        <p key={`${baseKey}-reciprocal`} className="text-left text-xs text-indigo-500">
                          Només compatible amb: <strong>{rule.sourceOption.name}</strong>
                        </p>
                      );
                    }

                    if (opt.id === rule.targetOption.id && !rule.reciprocal) {
                      items.push(
                        <p key={`${baseKey}-unique`} className="text-left text-xs text-gray-400">
                          Única compatible per: <strong>{rule.sourceOption.name}</strong>
                        </p>
                      );
                    }

                    return items;
                  }

                  case 'price_modifier':
                    return (
                      <p key={baseKey} className="text-left text-xs text-blue-500">
                        Alertació de preu amb: <strong>{opt.id === rule.targetOption.id ? rule.sourceOption.name : rule.targetOption.name}</strong>
                      </p>
                    );

                  default:
                    return null;
                }
              })}
          </div>
          )}
        </div>
      ))}
      <button
        onClick={() => setCreatingNew(true)}
        className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
      >
        ➕ Crear nova opció
      </button>

      {/* Modal per editar */}
      {editingOption && (
        <Modal onClose={() => setEditingOption(null)}>
          <OptionForm
            option={editingOption}
            attributeId={attributeId}
            onClose={() => setEditingOption(null)}
            item={item}
          />
        </Modal>
      )}

      {/* Modal per crear */}
      {creatingNew && (
        <Modal onClose={() => setCreatingNew(false)}>
          <OptionForm
            attributeId={attributeId}
            onClose={() => setCreatingNew(false)}
            item={item}
          />
        </Modal>
      )}
    </div>
  );
}
