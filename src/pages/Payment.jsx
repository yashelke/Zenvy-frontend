import React, { useEffect, useState } from "react";
import { CartData } from "@/context/CartContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "@/main";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const Payment = () => {
  const { cart, subTotal, fetchCart } = CartData();

  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  async function fetchAddress() {
    try {
      const data = await axios.get(`${server}/api/address/${id}`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setAddress(data.data.address);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAddress();
  }, [id]);

  console.log(address);

  const paymentHandler = async () => {
    if (method === "cod") {
      setLoading(true);
      try {
        const data = await axios.post(
          `${server}/api/order/new/cod`,
          {
            method,
            phone: address.phone,
            address: address.address,
          },
          {
            headers: {
              token: Cookies.get("token"),
            },
          },
        );

        setLoading(false);

        toast.success(data.data.message);

        fetchCart();

        navigate("/order");
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message);
      }
    }

    if (method === "online") {
      const stripePromise = loadStripe(
        "pk_test_51TNymoFJ4agmYvp4bn7UaAFXXNr9kkYsWpm6ag3FmLBnEU6aG7aILKIJE2EOUKXvtVVmIhDdRgA4NJ3EzcL0P37T00BFSCcfdj",
      );

      try{
              setLoading(true);

              const stripe = await stripePromise

              const {data} = await axios.post(`${server}/api/order/new/online`,{
                method, 
                phone: address.phone,
                address: address.address,
              },{
                headers: {
                  token: Cookies.get("token"),
                },
              });


              if(data.url){
                window.location.href = data.url
                setLoading(false);
              }
              else
              {
                toast.error("Failed to create Payment session.")
                setLoading(false);

              }


      }
      catch(error){
        setLoading(false);
        toast.error("Payment failed! Please try again.")
      }
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center">
                Proceed to Payment
              </h2>

              <div>
                <h3 className="text-xl font-semibold">Products</h3>
                <Separator className="my-2" />

                <div className="space-y-4">
                  {cart &&
                    cart.map((e, i) => (
                      <div
                        key={i}
                        className="flex flex-col md:flex-row items-center justify-between bg-card p-4 rounded-lg shadow border dark:border-blue-700"
                      >
                        <img
                          src={e.product.images[0].url}
                          alt=""
                          className="w-16 h-16 object-cover rounded mb-4 md:mb-0"
                        />

                        <div className="flex-1 md:ml-4 text-center md:text-left">
                          <h2 className="text-lg font-medium">
                            {e.product.title}
                          </h2>

                          <p className="text-sm text-muted-foreground dark:text-white">
                            {e.product.price} X {e.quantity}
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground dark:text-white">
                            <b>Total:</b> ₨. {e.product.price * e.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="text-lg font-medium text-center">
                Total Price to be Paid: ₨. {subTotal}
              </div>

              {/* Address Mapping */}

              {address && (
                <div className="bg-card p-4 rounded-lg shadow border space-y-4 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-center">Details</h3>
                  <Separator className="my-2" />

                  <div className="flex flex-col  space-y-4 ">
                    <div>
                      <h4 className="font-semibold mb-1">Delivery Address</h4>
                      <p className="text-sm text-muted-foreground dark:text-white">
                        <strong>Address:- {address.address}</strong>
                      </p>

                      <p className="text-sm text-muted-foreground dark:text-white">
                        <strong>Phone:- {address.phone}</strong>
                      </p>
                    </div>

                    <div className="w-full md:w-1/2">
                      <h4 className="font-semibold mb-1">
                        Select Payment Method
                      </h4>

                      <select
                        className="w-full p-2 border rounded-lg bg-card dark:bg-gray-900 dark:text-white"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                      >
                        <option value="">Select Method</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="online">Pay Online</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* button for paymentHandler */}

              <Button
                className="w-full py-3 mt-4"
                onClick={paymentHandler}
                disabled={!method || !address}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payment;
