import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard.jsx";
import { ProductData } from "@/context/ProductContext.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const { loading, products, newProd } = ProductData();

  return (
    <>
      {/* <div>HomePage</div> */}
      <div>
        <Hero navigate={navigate} />

        <div className="top products mt-4 p-4 sm:p-6">
          <h1 className="text-3xl mb-4">Latest Products</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {newProd && newProd.length > 0 ? newProd.map((product) => {
            return <ProductCard key={product._id} product={product} latest={"yes"} />;
          }) : (
            <p className="font-semibold ">No Products yet.</p>
          )}
              
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Home;
