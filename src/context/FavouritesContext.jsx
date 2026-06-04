import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    // Load initial favorites from localStorage if they exist
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Function to add a product to favorites
  const addToFavourites = (product) => {
    const exists = favourites.some((item) => item._id === product._id);
    if (!exists) {
      setFavourites((prev) => [...prev, product]);
      toast.success(`${product.name || "Product"} added to favourites!`);
    } else {
      toast.error("Product is already in favourites!");
    }
  };

  // Function to remove a product from favorites
  const removeFromFavourites = (productId) => {
    setFavourites((prev) => prev.filter((item) => item._id !== productId));
    toast.success("Removed from favourites!");
  };

  // Function to check if a product is already favourited
  const isFavourite = (productId) => {
    return favourites.some((item) => item._id === productId);
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addToFavourites,
        removeFromFavourites,
        isFavourite,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const FavouritesData = () => useContext(FavouritesContext);
