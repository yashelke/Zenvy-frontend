import React, { useState } from "react";
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from "../components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button";
import { UserData } from "@/context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const Login = () => {


  const[ email, setEmail] = useState("");

  const { loginUser , btnLoading } = UserData();

  const navigate = useNavigate();

  const submitHandler = (e) =>
  {
    // console.log(email);

    loginUser(email , navigate);

  }


  return (
    <>
      <div className="min-h-[60vh]">
        <Card className="md:w-[400px] sm:w-[300px] m-auto mt-5">
          <CardHeader>
            <CardTitle className="text-center">Login - Enter your email to get OTP.</CardTitle>
            <CardDescription>
              If you've already received OTP on email then you can directly go to opt tab.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">

            <div className="space-x-1 ">
              {/* <Label className="text-sm font-bold mb-2">Enter email:- </Label> */}
              <Label className="mb-2">Enter email:- </Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      
            </div>
          </CardContent>

          <CardFooter>
            <Button disabled={btnLoading} onClick={submitHandler}>
             {btnLoading ?  <Loader /> : "Submit"}
              </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;

