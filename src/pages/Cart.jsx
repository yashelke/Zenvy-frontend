import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartData } from "@/context/CartContext.jsx";
import {
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Trash2Icon,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, totalItem, subTotal, updateCart, removeFromCart } = CartData();

  const navigate = useNavigate();

  const updateCartHandler = async (action, id) => {
    await updateCart(action, id);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-red-600 ">Your Cart is Empty! 🛒</p>
            <Button
              className="mt-6 dark:hover:bg-amber-300 font-"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag size={20} /> Shop Now
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((e) => (
                <div
                  key={e._id}
                  className="flex flex-col sm:flex-row items-center sm:items-stretch space-y-4 sm:space-y-0 sm:space-x-4 shadow-md
              rounded-lg p-4 border-2 border-gray-400 dark:border-blue-500"
                >
                  <img
                    src={e.product.images[0].url}
                    alt={e.product.title}
                    className="w-full  sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer"
                    onClick={() => navigate(`/product/${e.product._id}`)}
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg font-medium">{e.product.title}</h2>
                    <p>Price: ₹{e.product.price}</p>
                  </div>

                  {/* Quantity Controls - Deacrease and Increase */}

                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-400 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                      onClick={() => updateCartHandler("dec", e._id)}
                    >
                      <b>-</b>
                    </Button>

                    <span className="font-medium">{e.quantity}</span>

                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-400 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                      onClick={() => updateCartHandler("inc", e._id)}
                    >
                      <b>+</b>
                    </Button>

                    <Button
                      variant="ghost"
                      className="text-red-500  hover:bg-red-600 hover:text-white"
                      onClick={() => removeFromCart(e._id)}
                    >
                      <Trash2Icon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}

            <div className="p-6 shadow-lg rounded-sm border-1 border-gray-400 h-fit sticky top-24">
              <h2 className="text-xl font-semibold mb-6 text-center lg:text-left">
                Order Summary
              </h2>

              <Separator className="mb-4" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Total Items:</span>
                  <span className="font-medium">{totalItem}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Price:</span>
                  <span className="font-medium">₹{subTotal}</span>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex justify-between font-medium text-lg mb-6">
                <span>Total:</span>
                <span className="text-blue-600 dark:text-blue-400">₹{subTotal}</span>
              </div>

              <Button className="w-full" onClick={() =>navigate("/checkout")} disabled={cart.length === 0}>Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
