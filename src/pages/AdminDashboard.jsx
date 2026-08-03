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
      <div className="min-h-screen bg-background">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close admin sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed left-0 right-0 bottom-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
            style={{ top: "var(--site-navbar-height, 0px)" }}
          />
        )}

        {/* sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 z-50 w-72 border-r border-gray-200 bg-background/95 shadow-xl backdrop-blur transition-transform duration-300 ease-in-out dark:border-blue-500 lg:translate-x-0 lg:w-72`}
          style={{
            top: "var(--site-navbar-height, 0px)",
            height: "calc(100vh - var(--site-navbar-height, 0px))",
          }}
        >
          <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-lg font-bold tracking-wide">Admin Panel</h1>

              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={() => setselectedPage("home")}
                className={`w-full justify-start gap-2 rounded-xl px-4 py-6 ${selectedPage === "home" ? "bg-gray-500 text-white hover:bg-gray-500 hover:text-white" : ""}`}
              >
                <Home className="h-5 w-5" />
                Home
              </Button>

              <Button
                variant="ghost"
                onClick={() => setselectedPage("orders")}
                className={`w-full justify-start gap-2 rounded-xl px-4 py-6 ${selectedPage === "orders" ? "bg-gray-500 text-white hover:bg-gray-500 hover:text-white" : ""}`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Orders
              </Button>

              <Button
                variant="ghost"
                onClick={() => setselectedPage("info")}
                className={`w-full justify-start gap-2 rounded-xl px-4 py-6 ${selectedPage === "info" ? "bg-gray-500 text-white hover:bg-gray-500 hover:text-white" : ""}`}
              >
                <Info className="h-5 w-5" />
                Info
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col lg:ml-72">
          {/* navbar */}
          <div className="sticky z-30 flex items-center justify-between border-b bg-background/80 p-4 shadow-sm backdrop-blur lg:justify-center"
            style={{ top: "var(--site-navbar-height, 0px)" }}
          >
            <Button variant="outline" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <MenuIcon className="h-5 w-5" />
            </Button>

            <h2 className="text-lg font-bold hidden lg:block">Admin Dashboard</h2>
          </div>

          {/* page render */}
          <main className="flex-1 p-4">
            {renderPageContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
