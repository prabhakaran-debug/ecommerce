import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import Header from "./Header";

function Dashboard() {
  const [datas, setDatas] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("price");
  const [selectedYear, setSelectedYear] = useState("2025"); 

  const paymentdataGet = () => {
    fetch("http://localhost:5000/api/payment")
      .then((response) => response.json())
      .then((data) => setDatas(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    paymentdataGet();
  }, []);

  useEffect(() => {
    if (datas.length > 0) {
      const monthlyData = {};

      datas.forEach((item) => {
        const date = new Date(item.currentdate);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (date.getFullYear().toString() === selectedYear) {
          if (!monthlyData[yearMonth]) {
            monthlyData[yearMonth] = { month: yearMonth, price: 0, quantity: 0 };
          }

          monthlyData[yearMonth].price += item.price;
          monthlyData[yearMonth].quantity += item.quantity;
        }
      });

      const formattedData = Object.values(monthlyData).map((data) => {
        const date = new Date(data.month + "-01");
        const monthName = date.toLocaleString("en-IN", { month: "short" }); 
        return { ...data, month: monthName };
      });

      setChartData(formattedData);
    }
  }, [datas, selectedYear]);

  return (
    <>
      <Header />
      <h2 className="ml-3 my-3">Annual Revenue</h2>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setSelectedMetric("price")} className="p-2 mx-3 btn btn-primary text-white rounded">
          Show Price
        </button>
        <button onClick={() => setSelectedMetric("quantity")} className="p-2 btn btn-primary text-white rounded">
          Show Quantity
        </button>

        <select
          className="p-2 mx-3 btn btn-primary"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)} // Handle year change
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={selectedMetric} fill={selectedMetric === "price" ? "#8884d8" : "#82ca9d"} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default Dashboard;
