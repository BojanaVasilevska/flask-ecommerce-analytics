import {
  Box,
  Button,
  IconButton,
  Input,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import { ResponsiveBar } from "@nivo/bar";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [averageSpendingByAgeRange, setAverageSpendingByAgeRange] = useState(
    []
  );

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:5000/average_spending_by_age/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User data fetched:", data);
        sessionStorage.setItem("userName", data.user_name);
        sessionStorage.setItem("totalSpending", data.total_spending);
        setUserInfo(data);
      })
      .catch((error) => {
        console.error("There was a problem fetching the user data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchAverageSpendingByAgeRange = () => {
    fetch(`http://127.0.0.1:5000/average_spending_by_age_range`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Average spending by age range data fetched:", data);
        const formattedData = Object.entries(
          data.average_spending_by_age_range
        ).map(([ageRange, value]) => ({
          id: ageRange,
          value: value,
        }));
        console.log("Formatted data:", formattedData);
        setAverageSpendingByAgeRange(formattedData);
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  };

  useEffect(() => {
    fetchAverageSpendingByAgeRange();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.orangeAmber[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.orangeAmber[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.orangeAmber[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.orangeAmber[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.orangeAmber[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.orangeAmber[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          {/* <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box> */}
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box>
              <Typography
                color={colors.orangeAmber[500]}
                variant="h5"
                fontWeight="600"
              ></Typography>
              <Typography color={colors.grey[100]}></Typography>
            </Box>
            <Box color={colors.grey[100]}>date</Box>
            <Box
              backgroundColor={colors.orangeAmber[500]}
              p="5px 10px"
              borderRadius="4px"
            ></Box>
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Total Spending
          </Typography>

          <Box mt="20px">
            <Typography
              variant="h4"
              sx={{ fontSize: "26px", color: colors.orangeAmber[500] }}
            >
              User Information:
            </Typography>
            <Input
              placeholder="Enter User ID"
              value={userId}
              onChange={handleUserIdChange}
            />
            <Typography variant="h5">
              Name: {isLoading ? "Loading..." : userInfo?.user_name || "N/A"}
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontSize: "22px", color: colors.orangeAmber[400] }}
            >
              Total Spending:{" "}
              {isLoading ? "Loading..." : userInfo?.total_spending || "N/A"}
            </Typography>
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
              }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Average Spending By Age
          </Typography>
          <Box height="200px" width="450px" mt="30px" ml="35px">
            <ResponsiveBar
              labelTextColor={colors.blueAccent[500]}
              data={averageSpendingByAgeRange}
              isDashboard={true}
              colors={{ scheme: "nivo" }}
              tooltip={(tooltip) => (
                <div
                  style={{
                    backgroundColor: "#3e4396",
                    border: "1px solid #3e4396",
                    borderRadius: "4px",
                    padding: "8px",
                    color: "#e0e0e0",
                    fontSize: "14px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <strong>{tooltip.data.id}</strong>: {tooltip.data.value}
                </div>
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
