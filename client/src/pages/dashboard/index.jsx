import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Input,
  Typography,
  useTheme,
  Paper,
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

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState("");
  const [userInsertId, setInsertUserId] = useState(0);
  const [moneySpent, setMoneySpent] = useState(0);
  const [year, setYear] = useState(0);
  const [isLoadingInsert, setIsLoadingInsert] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [averageSpendingByAgeRange, setAverageSpendingByAgeRange] = useState(
    []
  );
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState(null);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleInsertUserIdChange = (e) => {
    setInsertUserId(parseInt(e.target.value, 10));
  };

  const handleMoneySpentChange = (e) => {
    setMoneySpent(parseFloat(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };

  // Function to handle submit button click
  const handleInsertUserSubmit = () => {
    setIsLoadingInsert(true);
    setError(null);

    const userData = {
      user_id: userInsertId,
      money_spent: moneySpent,
      year: year,
    };

    fetch("http://localhost:5000/write_to_mongodb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit data. Please try again.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        setError("Failed to submit data. Please try again.");
      })
      .finally(() => {
        setIsLoadingInsert(false);
      });
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

  useEffect(() => {
    fetch("http://127.0.0.1:5000/user_spending_records")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User spending records fetched:", data);
        setItems(data.user_spending_records);
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch user data
    fetch("http://127.0.0.1:5000/github_user_data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User data fetched:", data);
        setUserData(data); // Update state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
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
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="5px"
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
                Insert User
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
          <Box
            mt="5px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              gridColumn="span 6"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box>
                <Typography sx={{ color: colors.orangeAmber[500] }}>
                  Enter User ID
                </Typography>
                <Input
                  placeholder="Enter User ID"
                  value={userInsertId}
                  onChange={handleInsertUserIdChange}
                />
              </Box>
              <Box>
                <Typography sx={{ color: colors.orangeAmber[500] }}>
                  Enter Money Spent
                </Typography>
                <Input
                  placeholder="Enter Money Spent"
                  value={moneySpent}
                  onChange={handleMoneySpentChange}
                />
              </Box>
              <Box>
                <Typography sx={{ color: colors.orangeAmber[500] }}>
                  Insert Current Year
                </Typography>
                <Input
                  placeholder="Enter Year"
                  value={year}
                  onChange={handleYearChange}
                />
              </Box>
              <Button
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  marginTop: "10px",
                }}
                onClick={handleInsertUserSubmit}
                disabled={isLoadingInsert}
              >
                {isLoadingInsert ? "Submitting..." : "Submit"}
              </Button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Box>
            <Box
              gridColumn="span 12"
              gridRow="span 2"
              backgroundColor={colors.orangeAmber[600]}
              style={{ overflowY: "auto" }}
              sx={{ maxHeight: "210px", width: "400px", borderRadius: "4px" }}
            >
              {items.map((item, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  style={{
                    padding: "10px",
                    marginBottom: "10px",
                    backgroundColor: colors.blueAccent[700],
                    margin: "10px",
                  }}
                >
                  <Typography variant="body2">
                    Money Spent: {item.money_spent}
                  </Typography>
                  <Typography variant="body2">
                    User ID: {item.user_id}
                  </Typography>
                  <Typography variant="body2">Year: {item.year}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
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
              GitHub User Data
            </Typography>
          </Box>
          <Box
            gridColumn="span 12"
            gridRow="span 2"
            backgroundColor={colors.orangeAmber[600]}
            style={{
              overflowY: "auto",
              maxHeight: "210px",
              width: "750px",
              borderRadius: "4px",
              margin: "20px",
            }}
          >
            <Box mt="20px" ml="10px" mr="10px">
              {userData && userData.github_user_data ? (
                <Box>
                  <Typography>
                    <strong>Bio:</strong> {userData.github_user_data.bio}
                  </Typography>
                  <Typography>
                    <strong>Blog:</strong> {userData.github_user_data.blog}
                  </Typography>
                  <Typography>
                    <strong>Collaborators:</strong>{" "}
                    {userData.github_user_data.collaborators}
                  </Typography>
                  <Typography>
                    <strong>Company:</strong>{" "}
                    {userData.github_user_data.company}
                  </Typography>
                  <Typography>
                    <strong>Created At:</strong>{" "}
                    {userData.github_user_data.created_at}
                  </Typography>
                  <Typography>
                    <strong>Disk Usage:</strong>{" "}
                    {userData.github_user_data.disk_usage}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {userData.github_user_data.email}
                  </Typography>
                  <Typography>
                    <strong>Followers:</strong>{" "}
                    {userData.github_user_data.followers}
                  </Typography>
                  <Typography>
                    <strong>Following:</strong>{" "}
                    {userData.github_user_data.following}
                  </Typography>
                  <Typography>
                    <strong>Hireable:</strong>{" "}
                    {userData.github_user_data.hireable}
                  </Typography>
                  <Typography>
                    <strong>Location:</strong>{" "}
                    {userData.github_user_data.location}
                  </Typography>
                  <Typography>
                    <strong>Login:</strong> {userData.github_user_data.login}
                  </Typography>
                  <Typography>
                    <strong>Name:</strong> {userData.github_user_data.name}
                  </Typography>
                  <Typography>
                    <strong>Owned Private Repos:</strong>{" "}
                    {userData.github_user_data.owned_private_repos}
                  </Typography>
                  <Typography>
                    <strong>Private Gists:</strong>{" "}
                    {userData.github_user_data.private_gists}
                  </Typography>
                  <Typography>
                    <strong>Public Gists:</strong>{" "}
                    {userData.github_user_data.public_gists}
                  </Typography>
                  <Typography>
                    <strong>Public Repos:</strong>{" "}
                    {userData.github_user_data.public_repos}
                  </Typography>
                  <Typography>
                    <strong>Type:</strong> {userData.github_user_data.type}
                  </Typography>
                  <Typography>
                    <strong>Updated At:</strong>{" "}
                    {userData.github_user_data.updated_at}
                  </Typography>
                </Box>
              ) : (
                <Typography>No GitHub user data available.</Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
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
            <Typography variant="h5" mt="15px">
              Name: {isLoading ? "Loading..." : userInfo?.user_name || "N/A"}
            </Typography>
            <Typography
              variant="h5"
              mt="10px"
              sx={{ fontSize: "22px", color: colors.orangeAmber[400] }}
            >
              Total Spending:{" "}
              {isLoading ? "Loading..." : userInfo?.total_spending || "N/A"}
            </Typography>
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                marginTop: "15px",
              }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
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
          <Box height="200px" width="600px" mt="30px" ml="60px">
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
