import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { server } from "@/main";
import { UserData } from "./UserContext.jsx";

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const { isAuth } = UserData();
  const [favourites, setFavourites] = useState([]);

  // Fetch favourites from backend database
  const fetchFavourites = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const { data } = await axios.get(`${server}/api/favourite/all`, {
        headers: { token },
      });
      setFavourites(data.favourites || []);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  // Fetch favourites on mount or when authentication state changes
  useEffect(() => {
    if (isAuth) {
      fetchFavourites();
    } else {
      setFavourites([]); // Clear favourites on logout
    }
  }, [isAuth]);

  // Add a product to favourites in the database
  const addToFavourites = async (product) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login to add favourites.");
        return;
      }

      const { data } = await axios.post(
        `${server}/api/favourite/add`,
        { productId: product._id },
        { headers: { token } }
      );

      // Instantly update local state to avoid refetching
      setFavourites((prev) => [...prev, product]);
      toast.success(data.message || "Added to favourites!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to favourites.");
    }
  };

  // Remove a product from favourites in the database
  const removeFromFavourites = async (productId) => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const { data } = await axios.delete(
        `${server}/api/favourite/remove/${productId}`,
        { headers: { token } }
      );

      // Instantly update local state
      setFavourites((prev) => prev.filter((item) => item._id !== productId));
      toast.success(data.message || "Removed from favourites!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove from favourites.");
    }
  };

  // Check if a product is already favourited in local state
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
        fetchFavourites,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export const FavouritesData = () => useContext(FavouritesContext);
