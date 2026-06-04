import React from 'react'
import { Button } from './ui/button';

const Hero = ({ navigate }) => {
  return (
   <>
   
   <div className="relative h-[calc(100vh-100px)] bg-cover bg-center" style={{
    backgroundImage : `linear-gradient(rgba(0,0,0,0.2) , rgba(0,0,0,0.2)), url("/bg image.jpg") `,
    paddingTop : "100px"
   }}>


  <div className="flex items-center justify-center h-full text-center text-white">
    <div>
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">Welcome to Your Dream Shop</h1>
        <p className="text-lg  sm:text-2xl mb-8">
            Discover amazing products and deals just for you!
        </p>

        {/* button to navigate to products */}
        <Button onClick={() => navigate('/products')} size="lg" className="hover:bg-yellow-300 font-bold rounded-full px-8 py-4" >
          Shop Now!
        </Button>
    </div>
  </div>
    
   </div>
   
   
   </>
  );
}

export default Hero;


