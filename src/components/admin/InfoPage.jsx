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

const InfoPage = () => {
  const [cod, setCod] = useState("");
  const [online, setOnline] = useState("");

  const [data, setData] = useState([]);

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
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const paymentData = [
    { method: "online", users: online, fill: "#03bafc" },
    { method: "cod", users: cod, fill: "#8c1251" },
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
                              {cod + online} Users
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
