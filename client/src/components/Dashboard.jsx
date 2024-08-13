import { Box, Divider, Typography } from "@mui/material";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import BookStatusTable from "./BookStatusTable";
import PieChartComponent from "./PieChart";
import Analytics from "./Analytics";
import { useEffect, useState } from "react";

const Dashboard = () => {
	const [totalPrice, setTotalPrice] = useState(0);
	const [lastMonthIncome, setLastMonthIncome] = useState(230);
	const [percentageChange, setPercentageChange] = useState(0);
	const now = new Date();
	const options = { weekday: "short" };
	const dayOfWeek = now.toLocaleDateString("en-US", options);
	const dayOfMonth = String(now.getDate()).padStart(2, "0");
	const month = now.toLocaleDateString("en-US", { month: "short" });
	const year = now.getFullYear();
	let hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12;
	const formattedTime = `${hours}.${minutes} ${ampm}`;
	const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}, ${year}, ${formattedTime}`;

	useEffect(() => {
		fetch(`${import.meta.env.VITE_SERVER_URL}/books`)
			.then((response) => response.json())
			.then((data) => {
				let total = 0;

				data.forEach((book) => {
					const price = parseFloat(book.price);
					if (!isNaN(price)) {
						total += price;
					}
				});

				setTotalPrice(total);

				if (lastMonthIncome > 0) {
					const change = ((total - lastMonthIncome) / lastMonthIncome) * 100;
					setPercentageChange(change.toFixed(2));
				}
			})
			.catch((error) => console.error("Error fetching data:", error));
	}, [lastMonthIncome]);
	return (
		<Box
			sx={{
				display: "flex",
				gap: 1,
				width: "100%",
			}}
		>
			<Box
				sx={{
					background: "#fff",
					borderRadius: "10px",
					boxShadow: 3,
					py: 3,
					px: 1,
					width: "256px",
					height: "fit-content",
				}}
			>
				<Typography
					sx={{ color: "gray", fontWeight: "bold", fontSize: "larger" }}
				>
					This Month Statistics
				</Typography>
				<Typography sx={{ color: "#b0a9a9", fontSize: "small" }}>
					{formattedDate}
				</Typography>

				<Box
					sx={{
						boxShadow: 3,
						py: 2,
						px: 1,
						borderRadius: 3,
						marginTop: 3,
						color: "gray",
						marginBottom: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							textUnderlineOffset: "4px",
						}}
					>
						<Typography>Income</Typography>
						<Typography
							sx={{
								background: "#e3dede",
								fontSize: "smaller",
								px: 1,
								marginBottom: 1,
								borderRadius: 1,
							}}
						>
							This Month
						</Typography>
					</Box>
					<Divider sx={{ marginBottom: 2 }} />
					<Typography
						sx={{
							fontWeight: "bold",
							fontSize: "21px",
							color: "#444",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						ETB {totalPrice}.00
						<Typography
							sx={{
								color: percentageChange < 0 ? "red" : "green",
								display: "flex",
								alignItems: "center",
							}}
						>
							{percentageChange < 0 ? (
								<>
									<ArrowDownwardOutlinedIcon /> {percentageChange}%
								</>
							) : (
								<>
									<ArrowUpwardOutlinedIcon /> {percentageChange}%
								</>
							)}
						</Typography>
					</Typography>
					<Typography sx={{ fontSize: "smaller" }}>
						Compared to ETB: {lastMonthIncome} last month
					</Typography>
					<Typography
						sx={{
							fontSize: "smaller",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							color: "#333",
						}}
					>
						Last Month Income{" "}
						<Typography sx={{ fontSize: "smaller" }}>
							ETB {lastMonthIncome}.00
						</Typography>
					</Typography>
				</Box>
				{/* pie chart component */}
				<PieChartComponent />
			</Box>
			<Box sx={{ width: "100%", pr: 1 }}>
				<Box
					sx={{
						background: "#fff",
						borderRadius: "10px",
						boxShadow: 5,
						padding: 3,
						marginBottom: 2,
					}}
				>
					<Typography
						sx={{ marginBottom: 1.2, fontWeight: "bold", color: "#666" }}
					>
						Live Book Status
					</Typography>
					<BookStatusTable />
				</Box>
				<Box
					sx={{
						background: "#fff",
						borderRadius: "10px",
						boxShadow: 3,
						padding: 3,
					}}
				>
					<Analytics />
				</Box>
			</Box>
		</Box>
	);
};

export default Dashboard;
