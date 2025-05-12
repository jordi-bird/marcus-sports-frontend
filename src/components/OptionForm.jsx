import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_OPTION, UPDATE_OPTION } from '../graphql/optionMutations';
import { GET_ATTRIBUTE_OPTIONS } from '../graphql/optionQueries';

export default function OptionForm({ option, attributeId, onClose }) {
  const isEditMode = !!option;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceDelta: 0,
    incompatibleOptionIds: [],
  });

  const { data: optionsData } = useQuery(GET_ATTRIBUTE_OPTIONS, {
    variables: { attributeId },
  });

  const [createOption] = useMutation(CREATE_OPTION, {
    refetchQueries: [{ query: GET_ATTRIBUTE_OPTIONS, variables: { attributeId } }],
  });

  const [updateOption] = useMutation(UPDATE_OPTION, {
    refetchQueries: [{ query: GET_ATTRIBUTE_OPTIONS, variables: { attributeId } }],
  });

  useEffect(() => {
    if (isEditMode && option) {
      setFormData({
        name: option.name || '',
        description: option.description || '',
        priceDelta: option.priceDelta || 0,
        incompatibleOptionIds: option.incompatibleOptionIds || [],
      });
    }
  }, [option, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const id = e.target.value;
      setFormData((prev) => {
        const list = new Set(prev.incompatibleOptionIds);
        checked ? list.add(id) : list.delete(id);
        return { ...prev, incompatibleOptionIds: Array.from(list) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateOption({
          variables: {
            id: option.id,
            name: formData.name,
            description: formData.description,
            priceDelta: formData.priceDelta,
            incompatibleOptionIds: formData.incompatibleOptionIds,
          },
        });
      } else {
        await createOption({
          variables: {
            attributeId,
            name: formData.name,
            description: formData.description,
            priceDelta: formData.priceDelta,
            incompatibleOptionIds: formData.incompatibleOptionIds,
          },
        });
      }

      onClose?.();
    } catch (err) {
      console.error('Error desant l’opció:', err.message);
    }
  };

  const availableOptions = optionsData?.attribute?.options || [];

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 rounded mt-4 bg-white">
      <h3 className="text-lg font-bold mb-2">
        {isEditMode ? `Editar Opció ${formData.name}` : 'Afegir nova opció'}
      </h3>

      <div className="mb-2">
        <label className="block font-medium">Nom</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Descripció</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Increment de preu (€)</label>
        <input
          name="priceDelta"
          type="number"
          value={formData.priceDelta}
          onChange={handleChange}
          step="0.01"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Opcions incompatibles</label>
        <div className="space-y-1 max-h-32 overflow-y-auto border p-2 rounded">
          {availableOptions
            .filter(o => !isEditMode || o.id !== option.id)
            .map((opt) => (
              <label key={opt.id} className="block text-sm">
                <input
                  type="checkbox"
                  value={opt.id}
                  checked={formData.incompatibleOptionIds.includes(opt.id)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt.name}
              </label>
            ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="text-gray-500 hover:underline">
          Cancel·la
        </button>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          {isEditMode ? 'Desar canvis' : 'Crear opció'}
        </button>
      </div>
    </form>
  );
}
