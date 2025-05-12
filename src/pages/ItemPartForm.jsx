import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PART, UPDATE_PART } from '../graphql/partMutations';
import { GET_ITEM } from '../graphql/itemQueries';
import { GET_ITEM_PART } from '../graphql/partQueries';
import ItemAttributeList from '../components/AttributeList';

import { useNavigate, useParams, Link } from 'react-router-dom';


export default function ItemPartForm({ mode }) {
  
    const navigate = useNavigate();
    const { itemId, itemPartId } = useParams();
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: null,
    });

    const { data: itemData } = useQuery(GET_ITEM, {
        variables: { itemId },
    });
      
    const { data: partData, loading: loadingPart } = useQuery(GET_ITEM_PART, {
        skip: !itemPartId,
        variables: { itemPartId:itemPartId },
    });
      

    const [CreateItemPart] = useMutation(CREATE_PART, {
    refetchQueries: [{ query: GET_ITEM, variables: { itemId } }],
    });

    const [updateItemPart] = useMutation(UPDATE_PART, {
    refetchQueries: [{ query: GET_ITEM, variables: { itemId } }, { query: GET_ITEM_PART, variables: { itemPartId:itemPartId } }],
    });

    useEffect(() => {
        if (itemPartId && partData?.itemPart) {
          setFormData({
            name: partData.itemPart.name || '',
            description: partData.itemPart.description || '',
            parentId: partData.itemPart.parentId || '',          
        });
        }
      }, [itemPartId, partData]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        if (isEditMode) {
        await updateItemPart({
            variables: {
            id: itemPartId,
            name: formData.name,
            description: formData.description,
            parentId: formData.parentId || null,
            },
        });
        } else {
        await CreateItemPart({
            variables: {
            itemId,
            name: formData.name,
            description: formData.description,
            parentId: formData.parentId || null,
            },
        });
        }

        navigate('/backoffice/items/' + itemId + '/edit');
    } catch (error) {
        console.error('Error en guardar la part:', error.message);
    }
    };

    return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <div className="border-b-4 text-white p-2 pb-4">
        <Link 
            to={`/backoffice/items/${itemId}/edit`}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded"
        >
        ← Torna enrere
      </Link>
        </div>
    <div className="border-b-4 text-gray p-2 pb-4">  
        <h1 className="text-2xl font-bold mb-4">
        {isEditMode
            ? `Edició de la part ${formData.name}`
            : loadingPart
            ? 'Carregant...'
            : `Crear nova part de ${itemData?.item?.name || ''}`}
        </h1>
        </div>  
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border rounded">
            <div>
            <label className="block font-medium">Nom de la part</label>
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
                rows={3}
                className="w-full border px-3 py-2 rounded"
            />
            </div>
            <div>
                <label className="block font-medium">Part pare (opcional)</label>
                <p className="text-sm text-gray-500 mb-2 italic">
                    Pots crear una jerarquia de fins a 3 nivells. Si una part ja és filla, es mostrarà com a tal.
                </p>
                <select
                    name="parentId"
                    value={formData.parentId || ''}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">-- Cap --</option>
                    {/*Limitem posibles pares a la 2a jerarquia */}
                    {itemData?.item?.itemParts
                        .flatMap((part) => [part, ...(part.children || [])])
                        .filter((part) => part.id !== itemPartId)
                        .map((part) => {
                            const parentName = itemData.item.itemParts.find(p => p.id === part.parentId)?.name;
                            return (
                            <option key={part.id} value={part.id}>
                                {part.name} {parentName ? `- filla de ${parentName}` : ''}
                            </option>
                            );
                        })
                    }
                </select>
            </div>
            <div className="flex justify-end gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ml-4 ">
                {isEditMode ? 'Desar canvis' : 'Crear part'}
            </button>
            </div>
        </form>
        {isEditMode && (
            <div className="p-6 mx-auto mt-10 border-t pt-6">
                <h1 className="text-2xl font-bold mb-4"> Atributs de {formData.name}</h1>
                <ItemAttributeList itemPartId={itemPartId} />
            </div>
        )}
    </div>
    );
}
