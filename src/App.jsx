// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// // import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React from "react";
import { Button } from "./components/ui/button";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { UserData } from "./context/UserContext.jsx";
import Verify from "./pages/Verify.jsx";
import Products from "./pages/Products.jsx";
import Loading from "./components/Loading";
import Cart from "./pages/Cart.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import Payment from "./pages/Payment.jsx";
import OrderProcessing from "./pages/OrderProcessing.jsx";
import Orders from "./pages/Orders.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const App = () => {
  const { isAuth, loading } = UserData();

  // console.log(user);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={isAuth ? <Cart /> : <Login />} />
            <Route path="/orders" element={isAuth ? <Orders /> : <Login />} />
            <Route
              path="/order/:id"
              element={isAuth ? <OrderPage /> : <Login />}
            />

            <Route
              path="/admin/dashboard"
              element={isAuth ? <AdminDashboard /> : <Login />}
            />

            <Route
              path="/checkout"
              element={isAuth ? <Checkout /> : <Login />}
            />

            <Route
              path="/payment/:id"
              element={isAuth ? <Payment /> : <Login />}
            />

            <Route
              path="/ordersuccess"
              element={isAuth ? <OrderProcessing /> : <Login />}
            />

            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
      {/* <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuth ? <Home /> : <Login />} />
          <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
        </Routes>
        <Footer />
      </BrowserRouter> */}

      {/* <div className="w-[200px] m-auto mt-14">

<Button variant="success">Shadcn button</Button>
  </div> */}
    </>
  );
};

export default App;
