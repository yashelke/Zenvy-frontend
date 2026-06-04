import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserData } from "@/context/UserContext";


const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const {user} = UserData();


  useEffect(() => {
    // Fetch order details using the id
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${server}/api/order/${id}`, {
          headers: {
            token: Cookies.get("token"),
          },
        });

        setOrder(data.order);
      } catch (error) {
        console.log(error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  //   console.log(order);

  //   return (
  //     <>
  //       <div>OrderPage</div>
  //     </>
  //   );

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-red-600 ">
            No Order exists with this ID.
          </h1>

          <Button onClick={() => navigate("/products")} className="mt-2">
            Shop Now !
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">

     
      {
        user._id === order.user._id || user.role === "admin" ? (<>


                  <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl font-bold">Order Details</CardTitle>

            <Button onClick={() => window.print()}>Print Order</Button>
          </div>
        </CardHeader>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <Separator className="mb-4" />

              <p className="mb-2">
                <strong>Order ID:</strong> {order._id}
              </p>

              <p className="mb-2">
                <strong>Status: </strong>
                <span
                  className={`${order.status?.toLowerCase() === "pending" ? "text-yellow-500" : order.status?.toLowerCase() === "shipped" ? "text-blue-500" : "text-green-500"} font-semibold`}
                >
                  {/* {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)} */}
                  {order.status}
                </span>
              </p>

              <p className="mb-2">
                <strong>Total Items: </strong> {order.items?.length || 0}
              </p>

              <p className="mb-2">
                <strong>Method of Payment: </strong>
                {order.method || "Not specified"}
              </p>

              <p className="mb-2">
                <strong>SubTotal: </strong>
                {order.subTotal?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>

              <p className="mb-2">
                <strong>Placed At: </strong>
                {new Date(order.createdAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="mb-2">
                <strong>Paid At: </strong>
                {order.paidAt
                  ? new Date(order.paidAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not paid yet"}
              </p>
            </div>

            {/* Shipping Details Info div */}

            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
              <Separator className="mb-4" />
              <p className="mb-2">
                <strong>Phone:</strong> {order.phone}
              </p>

              <p className="mb-2">
                <strong>Address:</strong> {order.address}
              </p>

              <p className="mb-2">
                <strong>Placed By:</strong> {order.user?.email || "Guest"}
              </p>
            </div>

            {/* <div>
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item._id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold">
                        {(item.price * item.quantity).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </Card>

      {/* Mapping the products */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 print:grid-cols-2 print:gap-2">
        {order.items.map((e, i) => (
          <Card key={i} className="flex flex-col h-full print:break-inside-avoid">
            <Link to={`/products/${e._id}`} className="block flex-shrink-0 print:pointer-events-none">
              <div className="w-full h-48 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800 print:h-32">
                <img
                  src={e.product.images[0]?.url}
                  alt={e.product.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            <CardContent className="flex-1 flex flex-col p-4">
              <h3 className="text-base font-semibold line-clamp-2 mb-2">{e.product.title}</h3>
              <div className="mt-auto space-y-1">
                <p className="text-sm">
                  <b>Quantity:</b> {e.quantity}
                </p>
                <p className="text-sm font-semibold">
                  <b>Price:</b> ₹ {e.product.price}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        
        
        
        
        
        
        </>) :(<p>This is not your order.</p>)
      }


        
        
        
      


    
    </div>
  )
};

export default OrderPage;
