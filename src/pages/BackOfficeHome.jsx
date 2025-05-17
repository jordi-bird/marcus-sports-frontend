import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ITEMS } from '../graphql/itemQueries';
import { DELETE_ITEM } from '../graphql/itemMutations';

export default function BackOfficeHome() {
  const { data, loading, error } = useQuery(GET_ITEMS);

  const [deleteItem] = useMutation(DELETE_ITEM, {
    refetchQueries: ['GetItems'],
  });

  const handleDelete = async (id) => {
    if (confirm('Segur que vols eliminar aquest ítem?')) {
      try {
        await deleteItem({ variables: { id } });
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  if (loading) return <p>Carregant ítems...</p>;
  if (error) return <p>Error carregant els ítems.</p>;

  const items = data.items;

  return (
    <div className="p-6">
      <div className="border-b-4 text-white p-2 pb-4 mb-4">
      <Link 
            to={`/`}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
        >
        ← Ves a la Home
      </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Gestió d’Ítems</h1>

      <div className="mb-4">
        <Link
          to="/backoffice/items/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Crear nou ítem
        </Link>
      </div>

      <table className="w-full border text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nom</th>
            <th className="p-2">Descripció</th>
            <th className="p-2">Accions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.description}</td>
              <td className="p-2">
                <Link
                  to={`/backoffice/items/${item.id}/edit`}
                  className="text-blue-600 hover:underline">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(item.id)} 
                    className="text-red-600 hover:underline ml-4">
                    Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
