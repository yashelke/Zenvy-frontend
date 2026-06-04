import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/all`, {
          headers: {
            token: Cookies.get("token"),
          },
        });

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  console.log(orders);

  //   return (
  //     <>
  //       <div>Orders Page</div>
  //     </>
  //   );

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return (
      <>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-red-600 ">No Orders Yet.</h1>

          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto py-6 px-4 min-h-[70vh]">
        <div className="text-3xl font-bold mb-6 text-center">Your Orders</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            return (
              <Card
                key={order._id}
                className="shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Order #{order._id.toUpperCase().slice(0, 8)}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p>
                    <strong>Status: </strong>
                    <span
                      className={`${order.status?.toLowerCase() === "pending" ? "text-yellow-500" : order.status?.toLowerCase() === "shipped" ? "text-blue-500" : "text-green-500"} font-semibold`}
                    >
                      {/* {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)} */}
                      {order.status}
                    </span>
                  </p>

                  <p>
                    <strong>Total Items: </strong>

                    {order.items.length}
                  </p>

                  <p>
                    <strong>SubTotal: </strong>

                    {order.subTotal.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>

                  <p>
                    <strong>Placed At: </strong>

                    {new Date(order.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <Button
                    outline="variant"
                    className={`mt-4 ${
                      order.status?.toLowerCase() === "pending"
                        ? "hover:bg-yellow-500"
                        : order.status?.toLowerCase() === "shipped"
                          ? "hover:bg-blue-500"
                          : "hover:bg-green-500"
                    }`}
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Orders;
