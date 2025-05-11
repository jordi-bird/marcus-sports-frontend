// src/pages/Home.jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ITEMS } from '../graphql/itemQueries';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { loading, error, data } = useQuery(GET_ITEMS);
  
  const navigate = useNavigate();

  if (loading) return <p className="text-center text-xl text-gray-500">Carregant productes...</p>;
  if (error) return <p className="text-center text-xl text-red-500">Error carregant els productes</p>;

  const handleClick = (itemId) => {
    navigate(`/configure/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-4xl font-semibold text-center text-indigo-600">Benvingut a la botiga de Marcus</h1>
        <p className="text-center text-lg text-gray-500">Selecciona un producte per començar la configuració personalitzada.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="cursor-pointer rounded-lg bg-white border border-gray-200 shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-2xl font-medium text-gray-800">{item.name}</h2>
                <p className="text-gray-500 mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;