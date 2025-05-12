import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ITEMS, GET_ITEM } from '../graphql/itemQueries';
import { CREATE_ITEM, UPDATE_ITEM } from '../graphql/itemMutations';
import { DELETE_PART } from '../graphql/partMutations';


export default function ItemForm({ mode }) {
  const navigate = useNavigate();
  const { itemId } = useParams();

  const isEditMode = mode === 'edit';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { data: itemData, loading } = useQuery(GET_ITEM, {
    skip: !isEditMode,
    variables: { itemId },
  });

  const [createItem] = useMutation(CREATE_ITEM);
  const [updateItem] = useMutation(UPDATE_ITEM);
  const [deleteItemPart] = useMutation(DELETE_PART, {
    refetchQueries: [{ query: GET_ITEM, variables: { itemId } }],
  });

  useEffect(() => {
    if (itemData?.item && isEditMode) {
      setFormData({
        name: itemData.item.name || '',
        description: itemData.item.description || '',
      });
    }
  }, [itemData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateItem({
          variables: {
            id: itemId,
            name: formData.name,
            description: formData.description,
          },
          refetchQueries: [{ query: GET_ITEMS }],
        });
      } else {
        await createItem({
          variables: {
            name: formData.name,
            description: formData.description,
          },
          refetchQueries: [{ query: GET_ITEMS }],
        });
      }
      
      navigate('/backoffice');
    } catch (error) {
      console.error('Error en guardar:', error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Segur que vols eliminar aquesta part?')) {
      try {
        await deleteItemPart({ variables: { id } });
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const renderPartRecursive = (part, level = 0) => {
    const containerClass = level === 0
    ? "border rounded p-3 mb-2"
    : "border-l-2 pl-4 ml-4 mb-2"; 
    return (
      <div key={part.id} className={containerClass}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{part.name}</p>
            <p className="text-sm text-gray-600">{part.description}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/backoffice/items/${itemId}/parts/${part.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Editar
            </Link>
            <button
              onClick={() => handleDelete(part.id)}
              className="text-red-600 hover:underline ml-4"
            >
              Eliminar
            </button>
          </div>
        </div>
    
        {/* Render children recursively */}
        {part.children && part.children.length > 0 && (
          <div className="mt-2 ml-4">
            {part.children.map(child => renderPartRecursive(child, level + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="border-b-4 text-white p-2 pb-4">
      <Link 
            to={`/backoffice`}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
        >
        ← Torna enrere
      </Link>
      </div>

      <div className="p-6 max-w- mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Editar Ítem' : 'Crear Nou Ítem'}
        </h1>

        {loading ? (
            <p>Carregant...</p>
            ) : (
            <>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Nom</label>
                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium">Descripció</label>
                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div className='justify-end flex'>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-right hover:bg-indigo-700"
                >
                    {isEditMode ? 'Desar canvis' : 'Crear ítem'}
                </button>
                </div>
                </form>

                {isEditMode && (
                <div className="p-6 mx-auto mt-10 border-t pt-6">
                    <div className="flex justify-start items-center mb-4">
                        <h2 className="text-xl text-center font-bold px-4 py-2 ">Parts de l’ítem</h2>
                        <Link 
                            to={`/backoffice/items/${itemId}/parts/new`}
                            className="ml-4 border border-indigo-600 hover:bg-gray-600/10 text-indigo-600 px-4 py-2 rounded"
                        >
                        + Afegeix nova part
                        </Link>
                    </div>
                    {itemData?.item?.itemParts?.length === 0 && (
                    <p className="text-gray-500 text-sm mb-4">
                        Aquest ítem no té cap part.
                    </p>
                    )}

                    {itemData?.item?.itemParts?.map(part => renderPartRecursive(part))}

                   
                </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
