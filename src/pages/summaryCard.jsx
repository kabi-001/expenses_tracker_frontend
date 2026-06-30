import { Card, CardContent, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function SummaryCards({ title, value, icon }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: 150,
      }}
    >
      <CardContent>
        {icon}

        <Typography variant="h6">{title}</Typography>

        <Typography variant="h4" fontWeight="bold" mt={2}>
          ₹{value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SummaryCards;
