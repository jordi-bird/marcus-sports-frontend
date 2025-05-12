import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_ATTRIBUTE, UPDATE_ATTRIBUTE } from '../graphql/attributeMutations';

export default function AttributeForm({ attribute, itemPartId, onClose }) {
  const isEditMode = !!attribute;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [createAttribute] = useMutation(CREATE_ATTRIBUTE, {
    refetchQueries: ['GetItemPartAttributes'],
  });

  const [updateAttribute] = useMutation(UPDATE_ATTRIBUTE, {
    refetchQueries: ['GetItemPartAttributes'],
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: attribute.name || '',
        description: attribute.description || '',
      });
    }
  }, [attribute, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateAttribute({
          variables: {
            id: attribute.id,
            name: formData.name,
            description: formData.description,
          },
        });
      } else {
        await createAttribute({
          variables: {
            itemPartId,
            name: formData.name,
            description: formData.description,
          },
        });

        // Neteja només si es crea
        setFormData({ name: '', description: '' });
      }

      onClose?.();
    } catch (err) {
      console.error('Error desant l’atribut:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-start md:items-center gap-2 p-3 bg-white border rounded w-full">
      {!isEditMode && (
        <span className="text-sm text-gray-600 italic">Afegint nou atribut</span>
      )}

      <input
        name="name"
        type="text"
        placeholder="Nom de l'atribut (p. ex. Color, Mida...)"
        value={formData.name}
        onChange={handleChange}
        required
        className="flex-1 border px-3 py-2 rounded w-full"
      />

      <div className="flex gap-2 mt-2 md:mt-0">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          {isEditMode ? 'Desar' : 'Afegir'}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:underline text-sm"
          >
            Cancel·la
          </button>
        )}
      </div>
    </form>
  );
}
