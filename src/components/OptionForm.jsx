import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_OPTION, UPDATE_OPTION } from '../graphql/optionMutations';

export default function OptionForm({ option: initialOption, attributeId, item, onClose, onCreated }) {

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: 0,
  });


  const [editingOption, setEditingOption] = useState(initialOption);
  const [incompatibilities, setIncompatibilities] = useState([]);
  const [compatibilities, setCompatibilities] = useState([]);
  const [priceOverrides, setPriceOverrides] = useState([]);

  const isEditMode = !!editingOption;

  const [createOption] = useMutation(CREATE_OPTION, {
    refetchQueries: ['GetItemPartAttributeOptions', 'GetItem'],
  });

  const [updateOption] = useMutation(UPDATE_OPTION, {
    refetchQueries: ['GetItemPartAttributeOptions'],
  });

  useEffect(() => {
    if (isEditMode && editingOption) {
      setFormData({
        name: editingOption.name || '',
        price: editingOption.price || 0,
        stock: editingOption.stock || 0,
      });

      if (isEditMode && editingOption?.rules) {
        setIncompatibilities(
          editingOption.rules
            .filter(rule => rule.ruleType === 'incompatibility')
            .map(rule => {
              const isCurrentOptionSource = rule.sourceOption?.id === editingOption.id;
              return {
                sourceOptionId: editingOption.id,
                targetOptionId: isCurrentOptionSource ? rule.targetOption?.id : rule.sourceOption?.id,
                reciprocal: true, // sempre true
              };
            })
        );

        setCompatibilities(
          editingOption.rules
            .filter(rule => rule.ruleType === 'compatibility' && rule.sourceOption.id ===  editingOption.id)
            .map(rule => {
              const isCurrentOptionSource = rule.sourceOption?.id === editingOption.id;
              return {
                sourceOptionId: editingOption.id,
                targetOptionId: isCurrentOptionSource ? rule.targetOption?.id : rule.sourceOption?.id,
                reciprocal: rule.reciprocal ?? false, // per defecte false
              };
            })
        );
      
        setPriceOverrides(
          editingOption.rules
            .filter(rule => rule.ruleType === 'price_modifier' && rule.sourceOption.id ===  editingOption.id)
            .map(rule => ({
              sourceOptionId: rule.sourceOption?.id || '',  
              targetOptionId: rule.targetOption?.id || '',
              modifierType: rule.operation || 'add', // 'add' o 'multiply'
              value: rule.value || 0,
              reciprocal: false, // sempre false segons requeriments
            }))
        );
      }
    }
  }, [editingOption, isEditMode]);

  const allAvailableOptions = item.itemParts.flatMap(part =>
    part.itemPartAttributes.filter(attr => !attributeId || attr.id !== attributeId) 
    .flatMap(attribute =>
      attribute.itemPartAttributeOptions
      .map(opt => ({
        id: opt.id,
        label: `${part.name}-${attribute.name}-${opt.name}`,
      }))
    )
  );

  const handleAddIncompatibility = () =>
    setIncompatibilities((prev) => [...prev, { sourceOptionId: editingOption.id, targetOptionId: '', reciprocal: true }]);

  const handleAddCompatibility = () =>
    setCompatibilities((prev) => [...prev, { sourceOptionId: editingOption.id, targetOptionId: '', reciprocal: false }]);

  const handleAddPriceOverride = () =>
    setPriceOverrides((prev) => [
      ...prev,
      { sourceOptionId: editingOption.id, targetOptionId: '', modifierType: 'add', value: 0, reciprocal: false },
    ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseInput = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rules: [
          ...incompatibilities.map((r) => ({
            ruleType: 'incompatibility',
            sourceOptionId: r.sourceOptionId,
            targetOptionId: r.targetOptionId,
            reciprocal: true,
          })),
          ...compatibilities.map((r) => ({
            ruleType: 'compatibility',
            sourceOptionId: r.sourceOptionId,
            targetOptionId: r.targetOptionId,
            reciprocal: r.reciprocal,
          })),
          ...priceOverrides.map((r) => ({
            ruleType: 'price_modifier',
            sourceOptionId: r.sourceOptionId,
            targetOptionId: r.targetOptionId,
            operation: r.modifierType,
            value: parseFloat(r.value),
            reciprocal: false,
          })),
        ],
      };
      
      // Afegim el camp corresponent segons el mode
      if (isEditMode) {
        baseInput.id = editingOption.id;
      } else {
        baseInput.itemPartAttributeId = attributeId;
      }

      const variables = {
        input: baseInput,
      };

      if(isEditMode) {
        await updateOption({ variables });
        onClose?.();
      }
      else{
        const { data } =  await createOption({ variables }); 
        const newOption = data?.createItemPartAttributeOption?.itemPartAttributeOption;
        setEditingOption(newOption); 
    
        // També pots fer un refetch o recarregar més dades si cal
      }      
    } catch (err) {
      console.error('Error desant l’opció:', err.message);
    }
  };

  const handleRuleChange = (setter, index, field, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveRule = (setter, indexToRemove) => {
    setter((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 rounded mt-4 bg-white space-y-4">
      <h3 className="text-lg font-bold">
        {isEditMode ? `Editar Opció ${formData.name}` : 'Afegir nova opció'}
      </h3>

      {/* Dades bàsiques */}
      <div>
        <label className="block font-medium">Nom</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Preu</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Stock</label>
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      { isEditMode && (
        <>
        {/* Incompatibilitat */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-medium">Opcions incompatibles</label>
            <button type="button" onClick={handleAddIncompatibility} className="text-sm text-blue-600">
              + Afegir
            </button>
          </div>
          {incompatibilities.map((rule, index) => (
            <div key={index} className="flex gap-2 mb-1 items-center">
              <select
                className="flex-1 border px-2 py-1 rounded"
                value={rule.targetOptionId}
                onChange={(e) =>
                  handleRuleChange(setIncompatibilities, index, 'targetOptionId', e.target.value)
                }
              >
                <option value="">-- Selecciona --</option>
                {allAvailableOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => handleRemoveRule(setIncompatibilities, index)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Només compatibles */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-medium">Només compatibles amb</label>
            <button type="button" onClick={handleAddCompatibility} className="text-sm text-blue-600">
              + Afegir
            </button>
          </div>
          {compatibilities.map((rule, index) => (
            <div key={index} className="flex gap-2 items-center mb-1">
              <select
                className="flex-1 border px-2 py-1 rounded"
                value={rule.targetOptionId}
                onChange={(e) =>
                  handleRuleChange(setCompatibilities, index, 'targetOptionId', e.target.value)
                }
              >
                <option value="">-- Selecciona --</option>
                {allAvailableOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <label className="text-sm ml-2">
                <input
                  type="checkbox"
                  checked={rule.reciprocal}
                  onChange={(e) =>
                    handleRuleChange(setCompatibilities, index, 'reciprocal', e.target.checked)
                  }
                  className="mr-1"
                />
                Reciprocal
              </label>
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => handleRemoveRule(setCompatibilities, index)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Price override */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-medium">Modificadors de preu</label>
            <button type="button" onClick={handleAddPriceOverride} className="text-sm text-blue-600">
              + Afegir
            </button>
          </div>
          {priceOverrides.map((rule, index) => (
            <div key={index} className="flex gap-2 mb-1 items-center">
              <select
                className="flex-1 border px-2 py-1 rounded"
                value={rule.targetOptionId}
                onChange={(e) =>
                  handleRuleChange(setPriceOverrides, index, 'targetOptionId', e.target.value)
                }
              >
                <option value="">-- Selecciona --</option>
                {allAvailableOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <select
                value={rule.modifierType}
                onChange={(e) =>
                  handleRuleChange(setPriceOverrides, index, 'modifierType', e.target.value)
                }
                className="border rounded px-2 py-1"
              >
                <option value="add">+ Suma</option>
                <option value="multiply">× Multiplica</option>
              </select>
              <input
                type="number"
                className="w-24 border px-2 py-1 rounded"
                value={rule.value}
                onChange={(e) => handleRuleChange(setPriceOverrides, index, 'value', e.target.value)}
                placeholder="Valor"
              />
              <button
                type="button"
                className="text-red-600 text-sm"
                onClick={() => handleRemoveRule(setPriceOverrides, index)}
              >
                🗑️
              </button>
            </div>
          ))}
        
        </div>
      </>)}

      {/* Accions */}
      <div className="flex gap-2 justify-end mt-4">
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
