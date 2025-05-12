import { useState } from 'react';
import OptionForm from './OptionForm';
import { useQuery } from '@apollo/client';
import { GET_ATTRIBUTE_OPTIONS } from '../graphql/optionQueries';

export default function OptionList({ attributeId }) {
  const { data, loading } = useQuery(GET_ATTRIBUTE_OPTIONS, {
    variables: { itemPartAttributeId: attributeId },
    skip: !attributeId,
  });

  const [expandedOptionId, setExpandedOptionId] = useState(null);
  const [editingOptionId, setEditingOptionId] = useState(null);

  if (loading) return <p>Carregant opcions...</p>;
  if (!data?.itemPartAttribute?.itemPartAttributeOptions) return <p>No s'han trobat opcions.</p>;

  return (
    <div className="space-y-1">
      {data.itemPartAttribute.itemPartAttributeOptions.map((opt) => (
        <div key={opt.id} className="p-2 border rounded bg-white">
          <div className="flex justify-between items-center">
            {editingOptionId === opt.id ? (
              <OptionForm
                option={opt}
                attributeId={attributeId}
                onClose={() => setEditingOptionId(null)}
              />
            ) : (
              <>
                <span>
                  <strong>{opt.name}</strong> - {opt.price}€
                </span>
                <div className="space-x-2">
                  <button onClick={() => setEditingOptionId(opt.id)} className="text-sm text-green-600">✏️ Edita</button>
                  <button
                    onClick={() => setExpandedOptionId(expandedOptionId === opt.id ? null : opt.id)}
                    className="text-sm text-green-600"
                  >
                    {expandedOptionId === opt.id ? '➖ Amaga detalls' : '➕ Detalls'}
                  </button>
                </div>
              </>
            )}
          </div>
          {expandedOptionId === opt.id && !editingOptionId && (
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
      <OptionForm attributeId={attributeId} />
    </div>
  );
}
