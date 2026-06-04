import { CartData } from "@/context/CartContext.jsx";
import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderProcessing = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [paymentVerified, setPaymentVerified] = useState(false);

  const { fetchCart } = CartData();

  const queryParams = new URLSearchParams(location.search);

  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Session ID is missing!");
        return navigate("/cart");
      }

      if (paymentVerified) {
        return;
      }

      setLoading(true);

      try {
        const { data } = await axios.post(
          `${server}/api/order/verify/payment`,
          {
            session_id: sessionId,
          },
          {
            headers: {
              token: Cookies.get("token"),
            },
          },
        );

        if (data.success) {
          toast.success("Order Placed successfully!");
          setPaymentVerified(true);
          fetchCart();
          setLoading(false);
          setTimeout(() => {
            navigate("/orders");
          }, 10000);
        }

        // setPaymentVerified(true);
      } catch (error) {
        toast.error("Payment verification failed! Please try again.");
        navigate("/cart");
        console.log(error);
      }
    };

    if (sessionId && !paymentVerified) {
      verifyPayment();
    }
  }, [sessionId, paymentVerified, navigate]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-500">
        {loading ? (
          <>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
              <h1 className="text-4xl font-extrabold text-blue-600 mb-4 ">
                Processing your order...
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Please wait while we process your payment & order.
              </p>
              <Loader />
              <div className="text-xl text-gray-500">Processing...</div>
            </div>
          </>
        ) : (
          <>
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
              <div>
                <h1 className="text-4xl font-bold text-green-500 mb-4">
                  Order Placed!
                </h1>

                <p className="text-lg text-black text-center mb-6">
                  Thank You for your purchase! Your Order will be delivered
                  soon.
                </p>

                <Button onClick={() => navigate("/orders")}>
                  View Orders Page
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderProcessing;
