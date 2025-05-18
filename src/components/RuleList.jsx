import React from 'react';

export default function RuleList({
  title,
  rules,
  options,
  onAdd,
  onRemove,
  onChange,
  showReciprocal = false,
  showModifierFields = false,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="font-medium">{title}</label>
        <button type="button" onClick={onAdd} className="text-sm text-blue-600">
          + Afegir
        </button>
      </div>
      {rules.map((rule, index) => (
        <div key={index} className="flex gap-2 items-center mb-1">
          <select
            className="flex-1 border px-2 py-1 rounded"
            value={rule.targetOptionId}
            onChange={(e) => onChange(index, 'targetOptionId', e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>

          {showModifierFields && (
            <>
              <select
                value={rule.modifierType}
                onChange={(e) => onChange(index, 'modifierType', e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="add">+ Suma</option>
                <option value="multiply">× Multiplica</option>
              </select>
              <input
                type="number"
                className="w-24 border px-2 py-1 rounded"
                value={rule.value}
                onChange={(e) => onChange(index, 'value', e.target.value)}
                placeholder="Valor"
              />
            </>
          )}

          {showReciprocal && (
            <label className="text-sm ml-2">
              <input
                type="checkbox"
                checked={rule.reciprocal}
                onChange={(e) => onChange(index, 'reciprocal', e.target.checked)}
                className="mr-1"
              />
              Reciprocal
            </label>
          )}

          <button
            type="button"
            className="text-red-600 text-sm"
            onClick={() => onRemove(index)}
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
