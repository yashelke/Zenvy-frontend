import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { CartProvider } from './context/CartContext.jsx';
import { FavouritesProvider } from './context/FavouritesContext.jsx';



// backend server url
export const server = "http://localhost:5000";

// export const server = "https://zenvy-server-fwxd.onrender.com"

export const categories = [
  "Earphones",
  "gaming",
  "laptop",
  "phones",
  "shoes",

  
];

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ThemeProvider>
    
    <UserProvider>
     <ProductProvider>
      <CartProvider>
        <FavouritesProvider>
          <App />
        </FavouritesProvider>
      
    
      </CartProvider>
     </ProductProvider>
    </UserProvider>
    
     
  </ThemeProvider>
  </StrictMode>,
)
