import Loading from "@/components/Loading.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductData } from "@/context/ProductContext.jsx";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard.jsx";

// Filter fields component shared between desktop and mobile
const FilterFields = ({
  search,
  setSearch,
  categories,
  category,
  setCategory,
  price,
  setPrice,
  activeFilterCount,
  clearFilter,
}) => (
  <div className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Search
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          className="w-full rounded-md pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Category
      </label>
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All categories</option>
        {(categories || []).map((c) => (
          <option value={c} key={c}>
            {c}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Sort by price
      </label>
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      >
        <option value="">Default</option>
        <option value="lowToHigh">Low to High</option>
        <option value="highToLow">High to Low</option>
      </select>
    </div>

    <Button
      variant="outline"
      disabled={activeFilterCount === 0}
      className="w-full"
      onClick={clearFilter}
    >
      Clear filters {activeFilterCount > 0 && `(${activeFilterCount})`}
    </Button>
  </div>
);

const Products = () => {
  const [show, setShow] = useState(false);
  const {
    loading,
    products,
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

  const activeFilterCount = [search, category, price].filter(Boolean).length;

  // Guard against a missing/NaN/zero totalPages from the API so pagination
  // logic below never has to special-case bad data more than once.
  const safeTotalPages =
    Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;

  const hasProducts = Array.isArray(products) && products.length > 0;

  // Only ever show pagination when there is provably more than one page of
  // results to move between. This is intentionally the single source of
  // truth for "should pagination render at all" — every other condition
  // (empty state, single match, loading) falls out of this automatically.
  const showPagination = !loading && hasProducts && safeTotalPages > 1;

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!show) return;
    const onKeyDown = (e) => e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show]);

  // Whenever a filter changes, the result set changes too — go back to
  // page 1 so the user never lands on a page that no longer exists.
  useEffect(() => {
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, price]);

  // Safety net: if totalPages ever shrinks below the current page for any
  // other reason, clamp back into range instead of showing a blank page.
  useEffect(() => {
    if (page > safeTotalPages) setPage(safeTotalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeTotalPages]);

  const clearFilter = () => {
    setPrice("");
    setCategory("");
    setSearch("");
    setPage(1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < safeTotalPages) setPage(page + 1);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-full">
      {/* Desktop sidebar - only visible on medium screens and up */}
      <aside
        className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-900 p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h2>
        </div>
        <FilterFields
          search={search}
          setSearch={setSearch}
          categories={categories}
          category={category}
          setCategory={setCategory}
          price={price}
          setPrice={setPrice}
          activeFilterCount={activeFilterCount}
          clearFilter={clearFilter}
        />
      </aside>

      {/* Mobile overlay - behind the drawer */}
      <div
        onClick={() => setShow(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300
          ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{
          top: "var(--site-navbar-height, 64px)",
        }}
      />

      {/* Mobile drawer - slides in from left */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`md:hidden fixed left-0 bottom-0 z-50 w-72 max-w-[80vw] overflow-y-auto
          bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-800 
          transition-transform duration-300 ease-in-out
          ${show ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          top: "var(--site-navbar-height, 64px)",
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
          </div>
          <button
            onClick={() => setShow(false)}
            aria-label="Close filters"
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          <FilterFields
            search={search}
            setSearch={setSearch}
            categories={categories}
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
            activeFilterCount={activeFilterCount}
            clearFilter={clearFilter}
          />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6">
        {/* Mobile filter button - only on mobile */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShow(true)}
            className="relative w-full flex items-center justify-center gap-2 px-4 py-2.5 
              bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center
                rounded-full bg-red-500 text-white text-xs font-bold"
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Products grid - grows to fill available space */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loading />
            </div>
          ) : hasProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} latest="no" />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <PackageSearch className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-60" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {activeFilterCount > 0
                    ? "No products match your filters"
                    : "No products available"}
                </p>
                {activeFilterCount > 0 && (
                  <Button
                    onClick={clearFilter}
                    variant="outline"
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pagination - only when there are multiple pages */}
        {showPagination && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-700 
                rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Page {page} of {safeTotalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={page === safeTotalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-700 
                rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
