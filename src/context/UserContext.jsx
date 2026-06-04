import { server } from "@/main";
import { User } from "lucide-react";
import {createContext, useContext, useEffect, useState} from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";


const UserContext = createContext();

const cookieOptions = {
    expires: 15,
    secure: window.location.protocol === "https:",
    sameSite: "strict",
    path: "/",
};


export const UserProvider = ({children}) =>
{
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);


    async function loginUser(email ,  navigate)
    {
        setBtnLoading(true);

        try{

            const { data } = await axios.post(`${server}/api/user/login`, {email});

            toast.success(data.message);
            localStorage.setItem("email", email);
            navigate("/verify");

            setBtnLoading(false);


        }
        catch(error)
        {
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
            setBtnLoading(false);

        }
    }


    async function verifyUser(otp, navigate, fetchCart)
    {

        setBtnLoading(true);

        const email = localStorage.getItem("email");

        try{

            const { data } = await axios.post(`${server}/api/user/verify`, {email , otp});

            toast.success(data.message);
            localStorage.clear();
            // navigate to home page after successful login
            navigate("/");

           setBtnLoading(false);
          
           setIsAuth(true);
           setUser(data.user);

            Cookies.set("token", data.token, cookieOptions);

            fetchCart();
        }
        catch(error)
        {
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
            setBtnLoading(false);

        }
    }

    function logoutUser(navigate, setTotalItem)
    {
        Cookies.remove("token", cookieOptions);
        localStorage.removeItem("email");
        setIsAuth(false);
        setUser([]);
        toast.success("Logged Out Successfully.");
        navigate("/login");
        setTotalItem(0);
    }


    // function to fetch the profile of the user.


    async function fetchUser (){
        try{

            const { data } = await axios.get(`${server}/api/user/me`, {

                headers:{
                    token: Cookies.get("token"),
                }

            });

            setIsAuth(true);
            // setUser(data.user);
            setUser(data.user);
            setLoading(false);


        }
        catch(error)
        {
            console.log(error);
            setIsAuth(false);
            setLoading(false);
        }
    }

    useEffect(() =>{
        fetchUser();

    },[]);

    return (
        <UserContext.Provider  value={{ user, setUser, loading, setLoading, btnLoading, setBtnLoading, isAuth, loginUser, setIsAuth, verifyUser, logoutUser }} >
        {children}
        <Toaster />
        
    </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);