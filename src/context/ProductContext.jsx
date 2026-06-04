// this is a context api for fetching the products from the bakcend and displaying it on the Home.jsx page

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { server } from "@/main";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);

  // loading animation
  const [loading, setLoading] = useState(true);

  // filtering states

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState([]);

  const [relatedProduct, setRelatedProduct] = useState([]);

  async function fetchProducts() {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${server}/api/product/all?search=${search}&category=${category}&sortByPrice=${price}&page=${page}`,
      );
      setProducts(data.products);
      setNewProd(data.newProduct);
      setCategories(data.categories);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }


  async function fetchProduct (id) {
    setLoading(true);

    try{

      const { data } = await axios.get(`${server}/api/product/${id}`)

      setProduct(data.product);
      setRelatedProduct(data.relatedProduct);
      setLoading(false);


    }
    catch(error){

      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [ search, category, price, page]);

  return (
    <ProductContext.Provider
      value={{
        loading,
        products,
        newProd,
        search,
        setSearch,
        categories,
        category,
        totalPages,
        setCategory,
        price,
        setPrice,
        page,
        setPage,
        fetchProduct,
        product,
        relatedProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const ProductData = () => useContext(ProductContext);
