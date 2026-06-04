import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext.jsx";
import { UserData } from "@/context/UserContext.jsx";
import { categories, server } from "@/main";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Edit, Loader, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FavouritesData } from "@/context/FavouritesContext.jsx";

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading } = ProductData();

  const { addToCart } = CartData();

  const { user, isAuth } = UserData();

  const { id } = useParams();

  console.log(product);
  console.log(relatedProduct);

  const addToCartHandler = () => {
    // add to cart function
    addToCart(product);
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  //  only admin can update the product details and this features will not be shown to simple users
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);

  const updateHandler = () => {
    setShow(!show);
    setCategory(product.category);
    setTitle(product.title);
    setAbout(product.about);
    setStock(product.stock);
    setPrice(product.price);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { title, about, stock, price, category },
        {
          headers: {
            token: Cookies.get("token"),
          },
        },
      );

      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
      setBtnLoading(false);
    } catch (error) {
      console.log("Error updating product:", error);
      toast.error(
        error.response.data.message ||
          "Failed to update product. Please try again.",
      );
      setBtnLoading(false);
    }
  };

  // update the images of the product is also a feature that admin can do

  const [updatedImages, setUpdatedImages] = useState(null);

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (!updatedImages || updatedImages.length === 0) {
      toast.error("Please select new images to update.");
      setBtnLoading(false);
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}`,
        formData,
        {
          headers: {
            token: Cookies.get("token"),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(data.message);
      fetchProduct(id);
      setBtnLoading(false);
    } catch (error) {
      console.log("Error updating product images:", error);
      toast.error(
        error.response.data.message ||
          "Failed to update product images. Please try again.",
      );
      setBtnLoading(false);
    }
  };

  // favourites functionality

  // const { toggleFavourite, favourites } = FavouriteData();

  // const addToFavouriteHandler = () => {
  //   if (!isAuth) {
  //     toast.error("Please login first");
  //     return;
  //   }

  //   toggleFavourite(product);
  // };

  // 2. Inside the ProductPage component, destructure the functions you need:
const { addToFavourites, removeFromFavourites, isFavourite } = FavouritesData();

  return (
    <>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <div className="container mx-auto px-4 py-8 ">
            {user && user.role === "admin" && (
              <div className="w-[300px] md:w-[450px] m-auto mb-5">
                <Button onClick={updateHandler}>
                  {show ? <X /> : <Edit />}
                </Button>
                {show && (
                  <div className="space-y-4 mt-2">
                    <div>
                      <Label>Title</Label>
                      <Input
                        placeholder="Enter product title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>About</Label>
                      <Input
                        placeholder="Enter product description"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input
                        placeholder="Enter product stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        placeholder="Enter product price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      {/* <Input
                        placeholder="Enter product category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      /> */}
                      <select
                        className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        {categories.map((e) => {
                          return (
                            <option value={e} key={e}>
                              {e}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <Button
                      onClick={submitHandler}
                      type="submit"
                      className="w-full"
                      disabled={btnLoading}
                    >
                      {btnLoading ? <Loader /> : "Update Product"}
                    </Button>
                  </div>
                )}
              </div>
            )}
            {product && (
              <div className="flex flex-col lg:flex-row items-start gap-14">
                <div className="w-full sm:w-[400px] md:w-[650px] relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {product.images &&
                        product.images.map((image, index) => {
                          return (
                            <CarouselItem key={index}>
                              <img
                                src={image.url}
                                alt="image"
                                className="w-full rounded-md"
                              />
                            </CarouselItem>
                          );
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
                  </Carousel>

                  {/* Image update form for admin */}

                  {user && user.role === "admin" && (
                    <form
                      onSubmit={handleSubmitImage}
                      className="flex flex-col gap-4"
                    >
                      <div>
                        <Label className="mt-2 font-semibold">
                          Upload new image
                        </Label>
                        <Input
                          className="block w-full mt-1 text-sm"
                          type="file"
                          name="files"
                          id="files"
                          multiple
                          accept="image/*"
                          onChange={(e) => setUpdatedImages(e.target.files)}
                        />
                        <Button
                          className="mt-1"
                          type="submit"
                          disabled={btnLoading}
                        >
                          {btnLoading ? <Loader /> : "Update Image"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="w-full lg:w-1/2 space-y-4">
                  <h1 className="text-2xl font-bold">{product.title}</h1>
                  <p className="text-lg">{product.about}</p>
                  <p className="text-xl font-semibold">₹ {product.price}</p>
                  {isAuth ? (
                    <>
                      {product.stock <= 0 ? (
                        <p className="text-red-600 text-2xl bg-red-100 w-full text-center py-2">
                          Out of Stock !
                        </p>
                      ) : (
                        <>
                          <Button
                            onClick={addToCartHandler}
                            className="rounded-2xl bg-blue-500 hover:bg-blue-600  dark:text-white font-semibold"
                          >
                            Add to Cart
                          </Button>

                          {/* <Button  className="rounded-2xl bg-blue-500 hover:bg-blue-600  dark:text-white font-semibold mx-2">
                          Add to Favourites
                        </Button> */}

                        {/* // 3. Update your Add to Favourites button in the JSX: */}
                          {isFavourite(product._id) ? (
                            <Button
                              onClick={() => removeFromFavourites(product._id)}
                              className="rounded-2xl bg-red-500 hover:bg-red-600 dark:text-white font-semibold mx-2"
                            >
                              Remove Favourite
                            </Button>
                          ) : (
                            <Button
                              onClick={() => addToFavourites(product)}
                              className="rounded-2xl bg-blue-500 hover:bg-blue-600 dark:text-white font-semibold mx-2"
                            >
                              Add to Favourites
                            </Button>
                          )}

                         
                        </>
                      )}
                    </>
                  ) : (
                    <p className="text-blue-500">
                      Please Login to Add to Cart{" "}
                    </p>
                  )}
                </div>
              </div>
            )}{" "}
          </div>
        )}

        {/* to display related products */}

        {relatedProduct?.length > 0 && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <div className="mt-12">
                <h2 className="text-xl font-bold">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {relatedProduct.map((e) => {
                    return <ProductCard key={e._id} product={e} />;
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductPage;
