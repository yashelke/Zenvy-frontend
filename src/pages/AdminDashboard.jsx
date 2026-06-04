import React from "react";
import { useState } from "react";
import HomePage from "@/components/admin/HomePage.jsx";
import OrdersPage from "@/components/admin/OrdersPage.jsx";
import InfoPage from "@/components/admin/InfoPage.jsx";
import { Button } from "@/components/ui/button";
import { Home, Info, MenuIcon, ShoppingCartIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserData } from "@/context/UserContext";

const AdminDashboard = () => {
  const [selectedPage, setselectedPage] = useState("home");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const { user } = UserData();

  if(user.role !== "admin"){

    return navigate("/");
  }

  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage />;
      case "orders":
        return <OrdersPage />;
      case "info":
        return <InfoPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* sidebar */}
        <div
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0  lg:relative lg:translate-x-0  h-full shadow-lg transition-transform duration-300 bg-background/50 border-r  border-gray-400 backdrop-blur z-50 dark:border-r-2 dark:border-blue-500`}
        >
          <div className="flex flex-col h-full p-4">
            <h1 className="text-lg font-bold mb-4">Admin Panel</h1>
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setselectedPage("home")}
                className={`w-full flex items-center gap-2  ${selectedPage === "home" ? "bg-gray-500 text-white" : ""}`}
              >
                <Home className="w-5 h-5" /> Home
              </Button>

              <Button
                variant="ghost"
                onClick={() => setselectedPage("orders")}
                className={`w-full flex items-center gap-2  ${selectedPage === "orders" ? "bg-gray-500 text-white" : ""}`}
              >
                <ShoppingCartIcon className="w-5 h-5" /> Orders
              </Button>


              <Button
                variant="ghost"
                onClick={() => setselectedPage("info")}
                className={`w-full flex items-center gap-2 ${selectedPage === "info" ? "bg-gray-500 text-white" : ""}`}
              >
                <Info className="w-5 h-5" /> Info
              </Button>

              {/* for smaller screens */}

              <Button variant="ghost" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" /> Close
            
              </Button>
            </div>
          </div>
        </div>


        <div className="flex-1 flex flex-col">
            {/* navbar */}

            <div className="shadow p-4 flex items-center justify-between lg:justify-end">
                <Button variant="outline" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <MenuIcon className="w-5 h-5" /> 
                </Button>

                <h2 className="text-lg font-bold hidden lg:block">Admin Dashboard</h2>
            </div>

            {/* page render */}

            <div className="p-4">
              {renderPageContent()}
            </div>




        </div>





      </div>
    </>
  );
};

export default AdminDashboard;
