import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('selectedOptions');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSelectedOptions(parsed);

      const calculatedTotal = Object.values(parsed).reduce((acc, option) => {
        let finalPrice = option.price;

        // Aplica modificadors de preu
        (option.rules || [])
          .filter(rule =>
            rule.ruleType === 'price_modifier' &&
            rule.targetOption?.id === option.id
          )
          .forEach(rule => {
            const dependency = Object.values(parsed).find(opt => opt.id === rule.sourceOption?.id);
            if (dependency) {
              if (rule.operation === 'add') finalPrice += rule.value;
              if (rule.operation === 'multiply') finalPrice *= rule.value;
            }
          });

        return acc + finalPrice;
      }, 0);

      setTotalPrice(calculatedTotal);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Compra simulada! Gràcies :)');
    localStorage.removeItem('selectedOptions');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resum de la teva configuració</h1>
      <ul className="mb-6 border p-4 rounded">
        {Object.entries(selectedOptions).map(([attrId, option]) => (
          <li key={attrId} className="flex justify-between border-b py-2">
            <span>{option.name}</span>
            <span>{option.price.toFixed(2)} €</span>
          </li>
        ))}
      </ul>
      <p className="text-xl font-semibold mb-4">Total: {totalPrice.toFixed(2)} €</p>

      <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
        <input type="text" placeholder="Nom complet" className="border rounded w-full p-2" required />
        <input type="email" placeholder="Email" className="border rounded w-full p-2" required />
        <input type="text" placeholder="Adreça d'enviament" className="border rounded w-full p-2" required />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Confirmar compra
        </button>
      </form>
    </div>
  );
}
