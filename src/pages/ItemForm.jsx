import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ITEMS, GET_ITEM } from '../graphql/itemQueries';
import { CREATE_ITEM, UPDATE_ITEM } from '../graphql/itemMutations';

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="border-b-4 text-white p-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
        >
          ← Torna enrere
        </button>
      </div>

      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Editar Ítem' : 'Crear Nou Ítem'}
        </h1>

        {loading ? (
          <p>Carregant...</p>
        ) : (
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

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {isEditMode ? 'Desar canvis' : 'Crear ítem'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
