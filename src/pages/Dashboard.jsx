import { useState, useEffect } from "react";
import axios from "axios";
import SummaryCards from "./summaryCard";
import Grid from "@mui/material/Grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import "../style/piechart.css"

function PieChart() {
 
    return (
 <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 3 }}>
      <SummaryCards title="Total Income" 
      icon={<AccountBalanceWalletIcon/>}
      value={income} 
    />
    </Grid>

    <Grid size={{ xs: 12, md: 3 }}>
      <SummaryCards title="Total Expense" 
      value={expense} 
      
      />
    </Grid>

    <Grid size={{ xs: 12, md: 3 }}>
      <SummaryCards title="Balance" value={income - expense} />
    </Grid>

    <Grid size={{ xs: 12, md: 3 }}>
      <SummaryCards
        title="Transactions"
        value={chartData.length}
      />
    </Grid>
  </Grid>
);
}
export default PieChart;