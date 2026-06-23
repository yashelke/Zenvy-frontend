import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, CartesianGrid, Label, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart } from "recharts";
import { Package, DollarSign, Users, Clock, Truck, CheckCircle2 } from "lucide-react";

const InfoPage = () => {
  const [cod, setCod] = useState("");
  const [online, setOnline] = useState("");
  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalShipped, setTotalShipped] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setCod(data.cod);
      setOnline(data.online);
      setData(data.data);
      setTotalProducts(data.totalProducts || 0);
      setTotalUsers(data.totalUsers || 0);
      setTotalShipped(data.totalShipped || 0);
      setTotalPending(data.totalPending || 0);
      setTotalDelivered(data.totalDelivered || 0);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const paymentData = [
    { method: "online", users: online, fill: "#03bafc" },
    { method: "COD", users: cod, fill: "#8c1251" },
  ];

  const paymentChartConfig = {
    users: {
      label: "Users",
    },

    online: {
      label: "Online",
      fill: "hls(var(--chart1))",
    },

    cod: {
      label: "COD",
      fill: "hls(var(--chart2))",
    },
  };

  const paymentPercentage = paymentData.map((data) => ({
    ...data,
    percentage: parseFloat(((data.users / (cod + online)) * 100).toFixed(2)),
  }));

  return (
    <>

    {/* Stats cards -grid displaying total products, total shipped, pending, and delivered orders, total users, total revenue */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Revenue */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-green-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-xl transition-all duration-500 group-hover:scale-150" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-500 dark:text-white uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">₹{totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all duration-300 group-hover:rotate-12">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Products */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-blue-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-xl transition-all duration-500 group-hover:scale-150" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-500 dark:text-white uppercase tracking-wider">Total Products</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{totalProducts}</h3>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-300 group-hover:rotate-12">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Users */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-purple-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-xl transition-all duration-500 group-hover:scale-150" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-500 dark:text-white uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{totalUsers}</h3>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all duration-300 group-hover:rotate-12">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-yellow-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-yellow-500/10 dark:bg-yellow-500/5 blur-xl transition-all duration-500 group-hover:scale-150" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-500 dark:text-white uppercase tracking-wider">Pending Orders</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{totalPending}</h3>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 rounded-xl transition-all duration-300 group-hover:rotate-12">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Shipped Orders */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-blue-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-xl transition-all duration-500 group-hover:scale-150" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-500 dark:text-white uppercase tracking-wider">Shipped Orders</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{totalShipped}</h3>
          </div>
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-xl transition-all duration-300 group-hover:rotate-12">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Delivered Orders */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-green-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-xl transition-all duration-500 group-hover:scale-150" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-500 dark:text-white uppercase tracking-wider">Delivered Orders</p>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{totalDelivered}</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl transition-all duration-300 group-hover:rotate-12">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>





      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0 text-center">
            <CardTitle>Pie Chart - Payment Method</CardTitle>
            <CardDescription>Payment Breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={paymentChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={paymentData}
                  dataKey={"users"}
                  nameKey={"method"}
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            // className="text-lg font-bold"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {cod + online} Orders
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Showing total users for payment methods.
            </div>
          </CardFooter>
        </Card>

        {/* show payment by percentage */}

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0 text-center">
            <CardTitle>Pie Chart - Payment Percentage</CardTitle>
            <CardDescription>Payment Breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={paymentChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={paymentPercentage}
                  dataKey={"percentage"}
                  nameKey={"method"}
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            // className="text-lg font-bold"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              100 %
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Displaying percentage distribution of payment methods among users.
            </div>
          </CardFooter>
        </Card>


        <Card>
            <CardHeader className="items-center pb-0 text-center">
            <CardTitle>Bar Chart - Products Sold</CardTitle>
            <CardDescription>Units Sold for each product</CardDescription>
          </CardHeader>

          <CardContent>
            <BarChart  width={600} height={400} data={data} margin={{top: 20, right: 30, left: 20, bottom: 50}}>

              <CartesianGrid strokeDasharray={"3 3"} stroke="#404040" />
              <XAxis dataKey={"sold"} tickLine={false} tickMargin={10}
              axisLine={false} tickFormatter={(value) => `${value}`} />

              <YAxis />

              <Tooltip cursor={{fill : "#ffffff0f"}} content={({payload})=> {
                if(payload && payload.length){
                  const {name, sold} = payload[0].payload

                  return(
                    <div style={{backgroundColor: "#1f2937", color: "#ffffff", padding: "10px", border: "1px solid #4b5563", fontSize: "12px", borderRadius: "6px"}}>

                      <strong>{name}</strong>
                      <br />
                      <span style={{color: "#93c5fd"}}>Sold: {sold}</span>

                    </div>
                  );
                }

                return null;
              }} />

              <Bar dataKey={"sold"} fill="#60a5fa" radius={8} />
           

            </BarChart>
          </CardContent>

             <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Hover over a bar to see the product details.
            </div>
          </CardFooter>

        </Card>
        
      </div>
    </>
  );
};

export default InfoPage;
