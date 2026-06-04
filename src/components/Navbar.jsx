import {
  ShoppingCart,
  User,
  LogIn,
  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu.jsx";
import { ModeToggle } from "./mode-toggle.jsx";
import { UserData } from "@/context/UserContext.jsx";
import { CartData } from "@/context/CartContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, logoutUser, user } = UserData();
  const email = user?.email;

  const { totalItem, fetchCart, setTotalItem } = CartData();

  const logoutHandler = () => {
    logoutUser(navigate, setTotalItem);
  };

  console.log(user);

  return (
    <>
      {/* <div>Navbar</div> */}

      <div className="z-50 sticky top-0 bg-background/50 border-b backdrop-blur">
        <div className="w-full px-4 sm:px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between border-b-2 border-gray-400 dark:border-b-2 dark:border-blue-500 ">
          {/* <h1 className="text-2xl font-bold">Ecommerce</h1> */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-0">
            <img
              src={"/shopping-cart.png"}
              alt="Zenvy Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
            />
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Zenvy
            </h1>
          </div>

          <ul className="flex justify-center items-center space-x-6  ">
            <li
              className="cursor-pointer hover:scale-110 hover:underline"
              onClick={() => navigate("/")}
            >
              Home
            </li>

            <li
              className="cursor-pointer hover:scale-110 hover:underline"
              onClick={() => navigate("/products")}
            >
              Products
            </li>

            <li
              className="cursor-pointer relative flex items-center hover:scale-105 "
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItem ? totalItem : 0}
              </span>
            </li>

            <li className="cursor-pointer hover:scale-110 hover:underline">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {isAuth ? <User /> : <LogIn />}
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel variant="default">
                    Account: {isAuth ? email : "Guest"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!isAuth ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/login")}>
                        Login
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/orders")}>
                        Your Orders
                      </DropdownMenuItem>

                      {user && user.role === "admin" && (
                        <DropdownMenuItem
                          onClick={() => navigate("/admin/dashboard")}
                        >
                          Dashboard
                        </DropdownMenuItem>
                      )}

                      {/* Notifications will be implemented using RabbitMQ later  */}
                      <DropdownMenuItem>
                        Notifications
                      </DropdownMenuItem>

                      {/* Favourites/ to mark a product as favourite will be implemented later */}

                      <DropdownMenuItem>
                      
                        Favourites
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={logoutHandler}>
                        LogOut
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            <ModeToggle />
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
