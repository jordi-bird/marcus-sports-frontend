import { useState, useEffect, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_OPTION, UPDATE_OPTION } from '../graphql/optionMutations';
import RuleList from './RuleList';

export default function OptionForm({ option: initialOption, attributeId, item, onClose, onCreated }) {
  const [formData, setFormData] = useState({ name: '', price: '', stock: 0 });
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
    if (!isEditMode || !editingOption) return;

    setFormData({
      name: editingOption.name || '',
      price: editingOption.price || 0,
      stock: editingOption.stock || 0,
    });

    const rules = editingOption.rules || [];

    setIncompatibilities(
      rules.filter(r => r.ruleType === 'incompatibility').map(r => ({
        sourceOptionId: editingOption.id,
        targetOptionId: r.sourceOption?.id === editingOption.id ? r.targetOption?.id : r.sourceOption?.id,
        reciprocal: true,
      }))
    );

    setCompatibilities(
      rules.filter(r => r.ruleType === 'compatibility' && r.sourceOption?.id === editingOption.id).map(r => ({
        sourceOptionId: r.sourceOption.id,
        targetOptionId: r.targetOption?.id || '',
        reciprocal: r.reciprocal ?? false,
      }))
    );

    setPriceOverrides(
      rules.filter(r => r.ruleType === 'price_modifier' && r.sourceOption?.id === editingOption.id).map(r => ({
        sourceOptionId: r.sourceOption.id,
        targetOptionId: r.targetOption?.id || '',
        modifierType: r.operation || 'add',
        value: r.value || 0,
        reciprocal: false,
      }))
    );
  }, [editingOption, isEditMode]);

  const allAvailableOptions = useMemo(() => (
    item.itemParts.flatMap(part =>
      part.itemPartAttributes.filter(attr => !attributeId || attr.id !== attributeId)
        .flatMap(attr =>
          attr.itemPartAttributeOptions.map(opt => ({
            id: opt.id,
            label: `${part.name}-${attr.name}-${opt.name}`,
          }))
        )
    )
  ), [item, attributeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseInput = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rules: [
        ...incompatibilities.map(r => ({ ruleType: 'incompatibility', ...r })),
        ...compatibilities.map(r => ({ ruleType: 'compatibility', ...r })),
        ...priceOverrides.map(r => ({
          ruleType: 'price_modifier',
          sourceOptionId: r.sourceOptionId,
          targetOptionId: r.targetOptionId,
          operation: r.modifierType,
          value: parseFloat(r.value),
          reciprocal: false,
        })),
      ],
    };

    if (isEditMode) baseInput.id = editingOption.id;
    else baseInput.itemPartAttributeId = attributeId;

    try {
      const mutation = isEditMode ? updateOption : createOption;
      const { data } = await mutation({ variables: { input: baseInput } });

      if (!isEditMode) {
        const newOption = data?.createItemPartAttributeOption?.itemPartAttributeOption;
        setEditingOption(newOption);
        onCreated?.(newOption);
      } else {
        onClose?.();
      }
    } catch (err) {
      console.error('Error desant l’opció:', err.message);
    }
  };

  const handleRuleChange = (setter) => (index, field, value) => {
    setter(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRuleRemove = (setter) => (index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleRuleAdd = (setter, template) => () => {
    setter(prev => [...prev, template]);
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

      {isEditMode && (
        <>
          <RuleList
            title="Opcions incompatibles"
            rules={incompatibilities}
            options={allAvailableOptions}
            onAdd={handleRuleAdd(setIncompatibilities, {
              sourceOptionId: editingOption.id,
              targetOptionId: '',
              reciprocal: true,
            })}
            onRemove={handleRuleRemove(setIncompatibilities)}
            onChange={handleRuleChange(setIncompatibilities)}
          />

          <RuleList
            title="Només compatibles amb"
            rules={compatibilities}
            options={allAvailableOptions}
            onAdd={handleRuleAdd(setCompatibilities, {
              sourceOptionId: editingOption.id,
              targetOptionId: '',
              reciprocal: false,
            })}
            onRemove={handleRuleRemove(setCompatibilities)}
            onChange={handleRuleChange(setCompatibilities)}
            showReciprocal
          />

          <RuleList
            title="Modificadors de preu"
            rules={priceOverrides}
            options={allAvailableOptions}
            onAdd={handleRuleAdd(setPriceOverrides, {
              sourceOptionId: editingOption.id,
              targetOptionId: '',
              modifierType: 'add',
              value: 0,
              reciprocal: false,
            })}
            onRemove={handleRuleRemove(setPriceOverrides)}
            onChange={handleRuleChange(setPriceOverrides)}
            showModifierFields
          />
        </>
      )}

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
