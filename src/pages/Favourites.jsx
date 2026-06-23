
import React from 'react';
import { FavouritesData } from '../context/FavouritesContext.jsx';
import { Link } from 'react-router-dom';
import { Trash } from 'lucide-react';

const Favourites = () => {
  const { favourites, removeFromFavourites } = FavouritesData();

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* <h1 className="text-3xl font-bold mb-6 dark:text-white">My Favourites</h1> */}

      <h1  className="relative inline-block text-3xl font-bold mb-6
             transition-colors duration-300 
             after:absolute after:left-0 after:bottom-0
             after:h-[2px] after:w-full after:bg-blue-600
             after:origin-left after:scale-x-0
             after:transition-transform after:duration-300
             hover:after:scale-x-100">My Favourites</h1>
      {favourites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No favourites added yet.</p>
          <Link to="/products" className="text-blue-500 hover:underline mt-4 inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favourites.map((product) => (
            <div key={product._id} className="border-2 border-gray-500 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <img 
                  src={product.images?.[0]?.url || product.image || "/placeholder.jpg"} 
                  alt={product.name} 
                  className="w-full h-48 object-contain mb-4 rounded" 
                />
                <h3 className="font-semibold text-lg dark:text-white mb-2">{product.title}</h3>
                <p className="text-blue-500 font-bold mb-4">₹ {product.price}</p>
              </div>
              <div className="flex gap-2">
                <Link 
                  to={`/product/${product._id}`} 
                  className="flex-1 text-center bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  View Info
                </Link>
                <button 
                  onClick={() => removeFromFavourites(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                  title="Remove from Favourites"
                >
                  {/* 🗑️ */}
                  <Trash size={18} />
                </button >
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
