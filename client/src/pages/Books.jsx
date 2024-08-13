import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Switch } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";

const Books = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_SERVER_URL}/books`)
			.then((response) => {
				const fetchedData = response.data.map((book) => ({
					author: book.author || "Harry",
					owner: (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Box
								component="img"
								src={book.coverimg}
								alt="book_owner"
								width="22px"
								height="22px"
								borderRadius="50%"
							/>
							<Typography>{book.owner}</Typography>{" "}
						</Box>
					),
					category: book.category || "Unknown",
					bookName: book.bookname,
					status: book.status,
				}));

				setData(fetchedData);
			})
			.catch((error) => {
				console.error("Error fetching data: ", error);
			});
	}, []);

	const handleToggleStatus = (index) => {
		setData((prevData) =>
			prevData.map((item, i) =>
				i === index ? { ...item, status: !item.status } : item
			)
		);
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "rowNumber",
				header: "No.",
				size: 20,
				Cell: ({ row }) => row.index + 1,
			},
			{
				accessorKey: "author",
				header: "Author",
				size: 170,
				Cell: ({ cell }) => (
					<Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
						{cell.getValue()}
					</Typography>
				),
			},
			{
				accessorKey: "owner",
				header: "Owner",
				size: 170,
				Cell: ({ cell }) => (
					<Typography sx={{ textAlign: "center" }}>
						{cell.getValue()}
					</Typography>
				),
			},
			{
				accessorKey: "category",
				header: "Category",
				size: 170,
				Cell: ({ cell }) => (
					<Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
						{cell.getValue()}
					</Typography>
				),
			},
			{
				accessorKey: "bookName",
				header: "Book Name",
				size: 170,
				Cell: ({ cell }) => (
					<Typography sx={{ textAlign: "center", textTransform: "capitalize" }}>
						{cell.getValue()}
					</Typography>
				),
			},
			{
				accessorKey: "status",
				header: "Status",
				size: 170,
				Cell: ({ row }) => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "#e6f3e6",
							borderRadius: 5,
							width: "124px",
						}}
					>
						<Typography
							sx={{
								color: row.original.status ? "#8AC58A" : "#FF0000",
								fontSize: "13px",
								marginRight: 1,
							}}
						>
							{row.original.status ? "Active" : "Inactive"}
						</Typography>
						<Switch
							checked={row.original.status}
							onChange={() => handleToggleStatus(row.index)}
							inputProps={{ "aria-label": "controlled" }}
							sx={{
								"& .MuiSwitch-switchBase.Mui-checked": {
									color: "#008000",
								},
								"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
									backgroundColor: "#008000",
								},
							}}
						/>
					</Box>
				),
			},
		],
		[data]
	);

	return (
		<Box
			sx={{
				bgcolor: "#fff",
				mx: 2,
				minHeight: "85vh",
				p: 3,
				borderRadius: 1,
				boxShadow: 3,
			}}
		>
			<Typography sx={{ marginBottom: 1.2, fontWeight: "bold", color: "#666" }}>
				List of Books
			</Typography>
			<Box width={"100%"}>
				<MaterialReactTable
					columns={columns}
					data={data}
					enableColumnResizing
					sx={{
						"& .MuiTable-root": {
							boxShadow: "none",
							backgroundColor: "#F0F2FF",
						},
						"& .MuiTableCell-root": {
							boxShadow: "none",
						},
					}}
				/>
			</Box>
		</Box>
	);
};

export default Books;
