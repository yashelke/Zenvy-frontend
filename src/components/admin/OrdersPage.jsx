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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";

const ORDERS_PER_PAGE = 10;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

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
      .filter((order) =>
        statusFilter === "all" ? true : order?.status === statusFilter
      )
    : [];

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, orders.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);


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

        <div className="flex flex-col gap-3 md:flex-row md:items-center ">
          <Input
            className="w-full md:flex-1 border-1 border-black"
            placeholder="Search by email, order ID, or date"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 w-full rounded-md border-1 border-black bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-56 dark:bg-input/30"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <Table className="border-2 border-gray-200">
                <TableHeader className="text-medium dark:bg-blue-500 dark:text-white">
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
                  {paginatedOrders.map((order) => (
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
                          className="w-37.5 rounded-md border px-3 py-2 dark:bg-white dark:text-black"
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

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1}-{Math.min(
                  currentPage * ORDERS_PER_PAGE,
                  filteredOrders.length
                )} of {filteredOrders.length} orders
              </p>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((page) => Math.max(page - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <span className="flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((page) => Math.min(page + 1, totalPages));
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        ) : (
          <p>No Orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
