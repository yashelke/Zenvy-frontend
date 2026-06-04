import Loading from "@/components/Loading.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductData } from "@/context/ProductContext.jsx";
import { Filter, Loader, X } from "lucide-react";
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard.jsx";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination.jsx";
const Products = () => {
  const [show, setShow] = useState(false);

  const {
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
  } = ProductData();


  const clearFilter = () => {
    setPrice("");
    setCategory("");
    setSearch("");
    setPage(1);
    };

    const nextPage = () =>
    {
      setPage(page + 1);
    }

      const prevPage = () =>
    {
      setPage(page - 1);
    }

  return (
    <>
      {/* <div>Products</div> */}

      <div className="flex flex-col md:flex-row h-full">
        <div
          className={`fixed inset-y-0 left-0 z-50 md:z-40 w-64 bg-white dark:bg-gray-800 shadow-lg 
          transform transition-transform duration-300 ease-in-out md:relative  border-r-2 rounded-r-sm border-gray-400 dark:border-blue-500 
             md:translate-x-0 ${show ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 relative ">
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-2 bg-gray-200 dark:bg-gray-700
                 text-gray-800 dark:text-white rounded-full p-2 md:hidden"
            >
              <X />
            </button>
            <h2 className="text-lg font-bold  mb-2">Filters</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Search Title
              </label>

              <Input
                type="text"
                placeholder="Search title..."
                className="w-full border rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((e) => {
                  return (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Price</label>
              <select
                className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              >
                <option value="">Select</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>

            <Button className="mt-2" onClick={clearFilter}>Clear Filter</Button>
          </div>
        </div>

        {/* fetch products */}
        <div className="flex-1 p-4">
          <button
            onClick={() => setShow(true)}
            className="md:hidden bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            <Filter />
          </button>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products && products.length > 0 ? (
                products.map((product) => {
                  return (
                    <ProductCard
                      key={product._id}
                      product={product}
                      latest={"no"}
                    />
                  );
                })
              ) : (
                <p className="font-semibold ">No Products yet.</p>
              )}
            </div>
          )}
          <div className="mt-2 mb-3">
            <Pagination>
              <PaginationContent>
                { page!==1 && (
                  <PaginationItem className="cursor-pointer" onClick={prevPage}>
                    <PaginationPrevious />
                  </PaginationItem>
                )}

                {
                  page !== totalPages && (

                    <PaginationItem className="cursor-pointer" onClick={nextPage}>
                    <PaginationNext />
                  </PaginationItem>


                  )
                }
              </PaginationContent>
            </Pagination>

          </div>


        </div>
      </div>
    </>
  );
};

export default Products;
