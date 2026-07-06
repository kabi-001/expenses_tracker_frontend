import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "./component/registerfrom";
import Login from "./component/login";
import VerifyOtp from "./component/verify";
import MyHeader from "./component/myheader";
import HelperRouter from "./component/header";
import Expense from "./component/expense.form";
import TwoLevelPieChart from "./component/chart";
import Chart from "./component/chart";
// import { Dashboard } from "@mui/icons-material";
import PieChart from "./pages/Dashboard";
// import Home from "./component/home";
// import ExpenseDashboard from "./component/expensechart";
// import Dashboard from "./component/expensechart";
// import Home from "./component/home";
function App(){
   console.log(import.meta.env.VITE_BACKEND_URL)
   console.log("URL:", `${import.meta.env.VITE_BACKEND_URL}/api/user/login`);
return (
  <>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  
  <BrowserRouter>
  <MyHeader/><br></br><br/>
  <Routes>
    <Route path="/" element={<Login/>}/> 
    <Route path="/verify" element={<VerifyOtp/>} />
    <Route path="/register" element = {<Form/>}/>
    <Route path="/expense/from" element={
      <HelperRouter>
      <Expense/>
      </HelperRouter>}/>
      <Route path="/chart" element={<Chart/>}/>
      <Route path="/dash" element={<PieChart/>}/>
  </Routes>
  
  </BrowserRouter>
  
  </>
)} 
export default App;
