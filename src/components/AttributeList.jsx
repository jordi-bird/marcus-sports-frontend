import { useState } from 'react';
import AttributeForm from './AttributeForm';
import OptionList from './OptionList';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ITEM_PART_ATTRIBUTES } from '../graphql/attributeQueries';
import { DELETE_ATTRIBUTE } from '../graphql/attributeMutations';

export default function ItemAttributeList({ itemPartId, item }) {
  const { data, loading } = useQuery(GET_ITEM_PART_ATTRIBUTES, { variables: { itemPartId } });

  const [deleteItemPartAttribute] = useMutation(DELETE_ATTRIBUTE, {
    refetchQueries: [{ query: GET_ITEM_PART_ATTRIBUTES, variables: { itemPartId } }],
  });

  const [expandedAttrId, setExpandedAttrId] = useState(null);
  const [editingAttrId, setEditingAttrId] = useState(null);


  const handleDelete = async (id) => {
    if (confirm('Segur que vols eliminar aquest atribut?')) {
      try {
        await deleteItemPartAttribute({ variables: { id } });
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  if (loading) return <p>Carregant atributs...</p>;


  return (
    <div className="space-y-2">
      {data.itemPart.itemPartAttributes.map(attr => (
        <div key={attr.id} className="border p-2 rounded bg-gray-50">
          <div className="flex items-center justify-between">
            <div className='mr-4'>
              <strong>{attr.name}</strong>
            </div>
            {editingAttrId === attr.id ? (
              <AttributeForm
                attribute={attr}
                itemPartId={itemPartId}
                onClose={() => setEditingAttrId(null)}
              />
            ) : (
              <>
              <div> </div>
                <div className="space-x-2">
                  <button onClick={() => setEditingAttrId(attr.id)} className="text-blue-500 text-sm"> Edita | </button> 
                  <button onClick={() => handleDelete(attr.id)} className="text-red-500 text-sm"> Elimina | </button>

                  <button onClick={() => setExpandedAttrId(expandedAttrId === attr.id ? null : attr.id)} className="text-gray-500 text-sm">
                    {expandedAttrId === attr.id ? '➖ Amaga opcions' : '➕ Mostra opcions'}
                  </button>
                </div>
              </>
            )}
          </div>

          {expandedAttrId === attr.id && (
            <div className="mt-2 pl-4 border-l">
              <OptionList attributeId={attr.id} item={item}/>
            </div>
          )}
        </div>
      ))}
      <AttributeForm itemPartId={itemPartId} />
    </div>
  );
}
