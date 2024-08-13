import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const PieChartComponent = () => {
  const cookie = new Cookies();
  const token = cookie.get("user_token");
  const filteredToken = token ? token : sessionStorage.getItem("user_token");
  const decodedToken = filteredToken ? jwtDecode(filteredToken) : "";
  const isAdmin = `${decodedToken.isadmin ? "admin" : "owner"}`;
  const owner = decodedToken.name;

  const [categoryCounts, setCategoryCounts] = useState({
    fiction: 0,
    selfhelp: 0,
    business: 0,
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/books`);
        const data = await response.json();

        let filteredData =
          isAdmin === "admin"
            ? data
            : data.filter((item) => {
                console.log(item.owner);
                if (item.owner === owner) {
                  return item;
                }
              });
        console.log(filteredData);
        const counts = {
          fiction: 0,
          selfhelp: 0,
          business: 0,
        };

        filteredData.forEach((book) => {
          const category = book.category.toLowerCase();
          if (counts.hasOwnProperty(category)) {
            counts[category] += 1;
          }
        });

        setCategoryCounts(counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBooks();
  }, [isAdmin, owner]);

  return (
    <Box
      sx={{
        boxShadow: 3,
        py: 2,
        px: 1,
        borderRadius: 3,
        marginTop: 3,
        color: "gray",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          textUnderlineOffset: "4px",
        }}
      >
        <Typography>Available Books</Typography>
        <Typography
          sx={{
            background: "#e3dede",
            fontSize: "smaller",
            px: 1,
            marginBottom: 1,
          }}
        >
          Today
        </Typography>
      </Box>
      <PieChart
        series={[
          {
            innerRadius: 40,
            outerRadius: 80,
            cx: 100,
            cy: 90,
            data: [
              { name: "Fiction", value: categoryCounts.fiction },
              { name: "SelfHelp", value: categoryCounts.selfhelp },
              { name: "Business", value: categoryCounts.business },
            ],
          },
        ]}
        width={400}
        height={200}
      />
      <Box>
        {Object.keys(categoryCounts).map((category) => (
          <Box
            key={category}
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  height: "16px",
                  width: "16px",
                  background: {
                    fiction: "#02B2AF",
                    selfhelp: "#2E96FF",
                    business: "#B800D8",
                  }[category],
                  borderRadius: "100%",
                }}
              ></Typography>{" "}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Box>{" "}
            <Typography>{categoryCounts[category]}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PieChartComponent;
