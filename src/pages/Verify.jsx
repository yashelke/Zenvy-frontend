import React, { use, useEffect, useState } from "react";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from "../components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button";
import { UserData } from "@/context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { CartData } from "@/context/CartContext.jsx";


const Verify = () => {

    const [otp, setOtp] = useState("");

  



    const navigate = useNavigate();

    const { btnLoading, loginUser, verifyUser } = UserData();

    const { fetchCart } = CartData();


    const submitHandler = () =>
    {
        verifyUser(Number(otp), navigate, fetchCart);

    }

      // recent OTP for about 90 seconds

      const [timer , setTimer] = useState(90);

      const [canResend , setCanResend] = useState(false);

      useEffect(()=>
    {
        if(timer > 0)
        {
            const interval = setInterval(() =>
            {
                setTimer((prevTimer) => prevTimer - 1);

            }, 1000);

            return ()=> clearInterval(interval);
        }
        else{

            setCanResend(true);


        }

    },[timer]);

    
    // format time in mm:ss format to display on the UI.

    const formatTime = (time) =>
    {
        const minutes = Math.floor(time / 60);

        const seconds = time % 60;

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }


    // resend OTP function
    const handleResendOtp = async () => {

        const email = localStorage.getItem("email");

        await loginUser(email, navigate);

        setTimer(90);

        setCanResend(false);


    }

  return (
   <>
    <div className="min-h-[60vh]">
           <Card className="md:w-[400px] sm:w-[300px] m-auto mt-5">
             <CardHeader>
               <CardTitle className="text-center" >Verify your account via OTP.</CardTitle>
               <CardDescription>
                 If you didn't receive OTP in your inbox then check your spam folder or try again after some time.
               </CardDescription>
             </CardHeader>
   
             <CardContent className="space-y-2">
   
               <div className="space-x-1 ">
                 {/* <Label className="text-sm font-bold mb-2">Enter email:- </Label> */}
                 <Label className="mb-2 text-sm font-semibold">Enter OTP:- </Label>
                 <Input type="number" value={otp} onChange={(e) => setOtp(e.target.value)} required />
   
         
               </div>
             </CardContent>
   
             <CardFooter>
               <Button disabled={btnLoading} onClick={submitHandler}>
                {btnLoading ?  <Loader /> : "Submit"}
                 </Button>
             </CardFooter>

             {/* div to display timer  */}
             <div className="flex flex-col justify-center items-center w-[200px] m-auto">
                <p className="text-lg mb-3">
                    {canResend ? "You can now resend OTP." : `Time Remaining: ${formatTime(timer)}`}
                </p>

                <Button onClick={handleResendOtp} disabled={!canResend} className="mb-3">Resend OTP</Button>
             </div>
           </Card>
         </div>
  
   
   </>
  )
}

export default Verify