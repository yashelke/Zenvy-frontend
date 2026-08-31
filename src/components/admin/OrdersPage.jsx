import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { PackageOpen, Search } from "lucide-react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const ORDERS_PER_PAGE = 10;

const getPageItems = (currentPage, totalPages) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("ellipsis-start");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("ellipsis-end");
  pages.push(totalPages);

  return pages;
};

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300",
  Shipped: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-300",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300",
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const OrderStatus = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || "bg-muted text-muted-foreground ring-border"}`}
  >
    {status || "Unknown"}
  </span>
);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await axios.get(`${server}/api/order/admin/all`, {
        headers: { token: Cookies.get("token") },
      });
      const ordersData = Array.isArray(response.data)
        ? response.data
        : response.data.orders || [];
      setOrders(ordersData);
    } catch (fetchError) {
      console.error("Error fetching orders:", fetchError);
      setOrders([]);
      setError("We couldn't load the orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = orders
    .filter((order) => {
      const date = moment(order.createdAt).format("DD MMM YYYY, h:mm A").toLowerCase();
      return [order?.user?.email, order?._id, date, order?.method, order?.status]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(normalizedSearch));
    })
    .filter((order) => statusFilter === "all" || order?.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );
  const firstVisibleOrder = filteredOrders.length ? (currentPage - 1) * ORDERS_PER_PAGE + 1 : 0;
  const lastVisibleOrder = Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, orders.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await axios.post(`${server}/api/order/status/${orderId}`, { status }, {
        headers: { token: Cookies.get("token") },
      });
      toast.success(data.message);
      await fetchOrders();
    } catch (updateError) {
      console.error("Error updating order status:", updateError);
      toast.error(updateError.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const renderStatusControl = (order) => (
    <select
      aria-label={`Update status for order ${order._id}`}
      value={order.status}
      disabled={updatingOrderId === order._id}
      className="h-9 w-full min-w-32 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-wait disabled:opacity-60 sm:w-36"
      onChange={(event) => updateOrderStatus(order._id, event.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
    </select>
  );

  const renderPagination = () => (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{firstVisibleOrder}-{lastVisibleOrder}</span> of {filteredOrders.length} orders
      </p>
      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent className="w-full justify-between sm:w-auto sm:justify-end">
          <PaginationItem>
            <PaginationPrevious
              href="#previous"
              isDisabled={currentPage === 1}
              onClick={(event) => {
                event.preventDefault();
                if (currentPage > 1) setCurrentPage((page) => page - 1);
              }}
            />
          </PaginationItem>
          {getPageItems(currentPage, totalPages).map((page) => (
            <PaginationItem key={page}>
              {typeof page === "string" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`#page-${page}`}
                  isActive={currentPage === page}
                  aria-label={`Go to page ${page}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#next"
              isDisabled={currentPage === totalPages}
              onClick={(event) => {
                event.preventDefault();
                if (currentPage < totalPages) setCurrentPage((page) => page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );

  return (
    <section className="mx-auto w-full max-w-screen-2xl space-y-6 p-1 sm:p-2 lg:p-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Operations</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Manage orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track fulfilment and keep every order moving.</p>
        </div>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 w-full pl-9"
            placeholder="Search email, order ID, date, method..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          aria-label="Filter orders by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:w-48"
        >
          <option value="all">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {loading ? <Loading /> : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-medium">{error}</p>
          <button type="button" className="mt-3 text-sm font-semibold text-primary underline underline-offset-4" onClick={fetchOrders}>Try again</button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
          <PackageOpen className="mx-auto size-10 text-muted-foreground/60" />
          <h2 className="mt-4 font-semibold">No orders found</h2>
          <p className="mt-1 text-sm text-muted-foreground">Try changing your search or status filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="hidden overflow-x-auto lg:block">
            <Table className="min-w-[920px]">
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-5">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead className="pr-5">Update status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="pl-5"><Link className="font-semibold text-primary hover:underline" to={`/order/${order._id}`}>#{order._id.slice(-8).toUpperCase()}</Link></TableCell>
                    <TableCell className="max-w-52 truncate">{order.user?.email || "Guest"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.subTotal)}</TableCell>
                    <TableCell className="capitalize">{order.method || "Online"}</TableCell>
                    <TableCell><OrderStatus status={order.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{moment(order.createdAt).format("DD MMM YYYY, h:mm A")}</TableCell>
                    <TableCell className="pr-5">{renderStatusControl(order)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y divide-border lg:hidden">
            {paginatedOrders.map((order) => (
              <article key={order._id} className="space-y-4 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link className="font-semibold text-primary hover:underline" to={`/order/${order._id}`}>#{order._id.slice(-8).toUpperCase()}</Link>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{order.user?.email || "Guest"}</p>
                  </div>
                  <OrderStatus status={order.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <div><p className="text-muted-foreground">Total</p><p className="mt-1 font-semibold">{formatCurrency(order.subTotal)}</p></div>
                  <div><p className="text-muted-foreground">Payment</p><p className="mt-1 capitalize">{order.method || "Online"}</p></div>
                  <div><p className="text-muted-foreground">Placed</p><p className="mt-1">{moment(order.createdAt).format("DD MMM YYYY")}</p></div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">Update status</span>
                  {renderStatusControl(order)}
                </div>
              </article>
            ))}
          </div>
          {renderPagination()}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
// import { server } from "@/main";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { Input } from "../ui/input";
// import Loading from "../Loading";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
// } from "../ui/pagination";
// import { Link } from "react-router-dom";
// import moment from "moment";
// import toast from "react-hot-toast";

// const ORDERS_PER_PAGE = 10;

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);

//   const [search, setSearch] = useState("");

//   const [statusFilter, setStatusFilter] = useState("all");

//   const [currentPage, setCurrentPage] = useState(1);

//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get(`${server}/api/order/admin/all`, {
//         headers: {
//           token: Cookies.get("token"),
//         },
//       });
//       console.log("API Response:", response);
//       const ordersData = Array.isArray(response.data)
//         ? response.data
//         : response.data.orders || [];
//       setOrders(ordersData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setOrders([]);
//       setLoading(false);
//     }
//   };


//   // Universal Filtering
//   // search filter for orders based on user email or order id and date or payment method or status

//   const filteredOrders = Array.isArray(orders)
//     ? orders.filter(
//         (order) =>
//           order?.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
//           order?._id?.toLowerCase().includes(search.toLowerCase()) ||
//           moment(order.createdAt)
//             .format("DD MMM YYYY, h:mm A")
//             .toLowerCase()
//             .includes(search.toLowerCase()) ||
//             order?.method?.toLowerCase().includes(search.toLowerCase()) ||
//             order?.status?.toLowerCase().includes(search.toLowerCase()),
          
//       )
//       .filter((order) =>
//         statusFilter === "all" ? true : order?.status === statusFilter
//       )
//     : [];

//   const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));

//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * ORDERS_PER_PAGE,
//     currentPage * ORDERS_PER_PAGE
//   );

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter, orders.length]);

//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [currentPage, totalPages]);


//   const updateOrderStatus = async (orderId, status) => {

//     setLoading(true);
//     try{

//       const {data} = await axios.post(`${server}/api/order/status/${orderId}`, {status}, {
//         headers:{
//           token: Cookies.get("token"),
//         }
//       });

//       toast.success(data.message);
//       fetchOrders();
//       setLoading(false);

//     }
//     catch(error){
//       console.error("Error updating order status:", error);
//       toast.error(error.response.data.message || "Failed to update order status. Please try again.");
//       setLoading(false);
//     }

//   }

//   return (
//     <>
//       <div className="p-6 space-y-6">
//         <h1 className="text-2xl font-bold">Manage Orders</h1>

//         <div className="flex flex-col gap-3 md:flex-row md:items-center ">
//           <Input
//             className="w-full md:flex-1 border-1 border-black"
//             placeholder="Search by email, order ID, or date"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="h-9 w-full rounded-md border-1 border-black bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-56 dark:bg-input/30"
//           >
//             <option value="all">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Shipped">Shipped</option>
//             <option value="Delivered">Delivered</option>
//           </select>
//         </div>

//         {loading ? (
//           <Loading />
//         ) : filteredOrders.length > 0 ? (
//           <div className="space-y-4">
//             <div className="overflow-x-auto rounded-xl border border-gray-200">
//               <Table className="border-2 border-gray-200">
//                 <TableHeader className="text-medium dark:bg-blue-500 dark:text-white">
//                   <TableRow>
//                     <TableHead>Order ID</TableHead>
//                     <TableHead>User Email</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Payment Method</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {paginatedOrders.map((order) => (
//                     <TableRow key={order._id}>
//                       <TableCell>
//                         <Link to={`/order/${order._id}`}>{order._id}</Link>
//                       </TableCell>

//                       <TableCell>{order.user.email}</TableCell>

//                       <TableCell>{order.subTotal}</TableCell>

//                       <TableCell>{order.method}</TableCell>

//                       <TableCell>
//                         <span
//                           className={`px-2 py-1 rounded-xl font-semibold text-white ${order.status === "Pending" ? "bg-yellow-500" : order.status === "Shipped" ? "bg-blue-500" : "bg-green-500"}`}
//                         >
//                           {order.status}
//                         </span>
//                       </TableCell>

//                       <TableCell>
//                         {moment(order.createdAt).format("DD MMM YYYY, h:mm A")}
//                       </TableCell>

//                       <TableCell>
//                         <select
//                           value={order.status}
//                           className="w-37.5 rounded-md border px-3 py-2 dark:bg-white dark:text-black"
//                           onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                         >
//                           {/* <option value="">Select Action</option> */}
//                           <option value="Pending">Pending</option>
//                           <option value={"Shipped"}>Shipped</option>
//                           <option value={"Delivered"}>Delivered</option>
//                         </select>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
//               <p className="text-sm text-muted-foreground">
//                 Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1}-{Math.min(
//                   currentPage * ORDERS_PER_PAGE,
//                   filteredOrders.length
//                 )} of {filteredOrders.length} orders
//               </p>

//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       href="#"
//                       onClick={(event) => {
//                         event.preventDefault();
//                         setCurrentPage((page) => Math.max(page - 1, 1));
//                       }}
//                       className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
//                     />
//                   </PaginationItem>

//                   <PaginationItem>
//                     <span className="flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium">
//                       {currentPage} / {totalPages}
//                     </span>
//                   </PaginationItem>

//                   <PaginationItem>
//                     <PaginationNext
//                       href="#"
//                       onClick={(event) => {
//                         event.preventDefault();
//                         setCurrentPage((page) => Math.min(page + 1, totalPages));
//                       }}
//                       className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           </div>
//         ) : (
//           <p>No Orders found.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default OrdersPage;
