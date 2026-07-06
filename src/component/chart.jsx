import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import "../style/chart.css";
import SummaryCards from "../pages/summaryCard";


function Chart() {
  const [chartData, setChartData] = useState([]);
  const token = localStorage.getItem("auth_token");
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

 const fetchData = async () => {
  try {
    const res = await axios.get(
      `${process.env.VITE_BACKEND_URL}/api/expense/all`,
      {
        headers: getAuthHeader(),
      }
    );
    console.log(res.data.expenses);
    console.log(res.data.chartData); 

    setChartData(res.data.expenses);
  } catch (err) {
    console.log(err);
  }
};
  
  const expense = chartData
  .filter((item) => item.type === "expense")
  .reduce((acc, curr) => acc + Number(curr.amount), 0);
  console.log("expense:",expense)
  console.log("type",chartData);
  useEffect(() => {
    fetchData();
  }, []);

  const income = chartData
  .filter((item) => item.type === "income")
    .reduce((acc, curr) => acc + Number (curr.amount), 0);
  console.log("income", income);
  console.log(chartData);
  console.log("====>", typeof chartData);

  const incomeExpenseData = [
    { label: "Income", value: income },
    { label: "Expense", value: expense },
  ];
  const categoryData = chartData
    .filter((item) => item.type === "expense")
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.label === curr.category);

      if (existing) { 
        existing.value += Number (curr.amount);
      } else {
        acc.push({
          label: curr.category,
          value:  Number(curr.amount),
        });
      }

      return acc;
    }, []);

    return (
  <>
    <div className="summary-cards">
      <div className="summary-card income">
        <h3>Total Income</h3>
        <h2>₹ {income.toLocaleString()}</h2>
      </div>

      <div className="summary-card expense">
        <h3>Total Expense</h3>
        <h2>₹ {expense.toLocaleString()}</h2>
      </div>

      <div className="summary-card balance">
        <h3>Balance</h3>
        <h2>₹ {(income - expense).toLocaleString()}</h2>
      </div>
    </div>

    <div className="chart-container">
      <div className="chart-card">
        <h2>Expense By Category</h2>

        <PieChart
          width={500}
          height={300}
          series={[
            {
              data: categoryData.map((item, index) => ({
                id: index,
                ...item,
              })),
            },
          ]}
        />
      </div>

      <div className="chart-card">
        <h2>Income vs Expense</h2>

        <PieChart
          width={400}
          height={250}
          series={[
            {
              data: incomeExpenseData.map((item, index) => ({
                id: index,
                ...item,
              })),
            },
          ]}
        />
      </div>
    </div>
  </>
);
}
export default Chart;
