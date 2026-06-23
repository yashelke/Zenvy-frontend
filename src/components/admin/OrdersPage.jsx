import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Input } from "../ui/input";
import Loading from "../Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${server}/api/order/admin/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });
      console.log("API Response:", response);
      const ordersData = Array.isArray(response.data)
        ? response.data
        : response.data.orders || [];
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setLoading(false);
    }
  };


  // Universal Filtering
  // search filter for orders based on user email or order id and date or payment method or status

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (order) =>
          order?.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
          order?._id?.toLowerCase().includes(search.toLowerCase()) ||
          moment(order.createdAt)
            .format("DD MMM YYYY, h:mm A")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
            order?.method?.toLowerCase().includes(search.toLowerCase()) ||
            order?.status?.toLowerCase().includes(search.toLowerCase()),
          
      )
    : [];

  useEffect(() => {
    fetchOrders();
  }, []);


  const updateOrderStatus = async (orderId, status) => {

    setLoading(true);
    try{

      const {data} = await axios.post(`${server}/api/order/status/${orderId}`, {status}, {
        headers:{
          token: Cookies.get("token"),
        }
      });

      toast.success(data.message);
      fetchOrders();
      setLoading(false);

    }
    catch(error){
      console.error("Error updating order status:", error);
      toast.error(error.response.data.message || "Failed to update order status. Please try again.");
      setLoading(false);
    }

  }

  return (
    <>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>

        <Input
          className="w-full md:w-1/2"
          placeholder="Search by email, order ID, or date"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Loading />
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="border-t-2 border-amber-200">
              <TableHeader className="text-medium dark:bg-amber-500 dark:text-white">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Link to={`/order/${order._id}`}>{order._id}</Link>
                    </TableCell>

                    <TableCell>{order.user.email}</TableCell>

                    <TableCell>{order.subTotal}</TableCell>

                    <TableCell>{order.method}</TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-xl font-semibold text-white ${order.status === "Pending" ? "bg-yellow-500" : order.status === "Shipped" ? "bg-blue-500" : "bg-green-500"}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      {moment(order.createdAt).format("DD MMM YYYY, h:mm A")}
                    </TableCell>

                    <TableCell>
                      <select
                        value={order.status}
                        className="w-[150px] px-3 py-2 border rounded-md dark:bg-white dark:text-black"
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        {/* <option value="">Select Action</option> */}
                        <option value="Pending">Pending</option>
                        <option value={"Shipped"}>Shipped</option>
                        <option value={"Delivered"}>Delivered</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>No Orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
