import {
	Box,
	Button,
	IconButton,
	Typography,
	Switch,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@mui/material";
import React, { useMemo, useState, useEffect } from "react";
import {
	MaterialReactTable,
	useMaterialReactTable,
} from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

const Owners = () => {
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedOwner, setSelectedOwner] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const usersResponse = await axios.get(
					`${import.meta.env.VITE_SERVER_URL}/accounts/users`
				);
				const usersData = usersResponse.data.filter((item) => !item.isadmin);

				const booksResponse = await axios.get(
					`${import.meta.env.VITE_SERVER_URL}/books`
				);
				const booksData = booksResponse.data;

				const ownersData = usersData.map((user) => {
					const userBooks = booksData.filter(
						(book) => book.owner === user.name
					);
					const totalQuantity = userBooks.reduce(
						(sum, book) => sum + book.quantity,
						0
					);
					return { ...user, upload: totalQuantity };
				});

				setData(ownersData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	const handleClickOpen = (owner) => {
		setSelectedOwner(owner);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSelectedOwner(null);
	};

	const handleChange = (index) => (event) => {
		const newData = [...data];
		newData[index].status = event.target.checked;
		setData(newData);
	};

	const handleDelete = async (id) => {
		try {
			window.location.reload();
			await axios.delete(
				`${import.meta.env.VITE_SERVER_URL}/accounts/users/${id}`
			);
			setData((prevData) => prevData.filter((book) => book.id !== id));
		} catch (error) {
			console.error("Error deleting book:", error);
		}
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
				accessorKey: "name",
				header: "Owner",
				size: 120,
				Cell: ({ cell }) => (
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Box
							component="img"
							src="/user.jpg"
							alt="book_owner"
							width="22px"
							height="22px"
						/>
						<Typography>{cell.getValue()}</Typography>
					</Box>
				),
			},
			{
				accessorKey: "upload",
				header: "Upload",
				size: 120,
				Cell: ({ cell }) => (
					<Typography
						sx={{
							textAlign: "center",
							borderRadius: "4px",
							width: "fit-content",
							textTransform: "capitalize",
						}}
					>
						{cell.getValue()}
					</Typography>
				),
			},
			{
				accessorKey: "location",
				header: "Location",
				size: 120,
				Cell: ({ cell }) => (
					<Typography
						sx={{
							textAlign: "center",
							borderRadius: "4px",
							width: "fit-content",
							textTransform: "capitalize",
						}}
					>
						{cell.getValue()}
					</Typography>
				),
			},
			{
				accessorKey: "status",
				header: "Status",
				size: 120,
				Cell: ({ row }) => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							bgcolor: "#E6F3E6",
							borderRadius: "50px",
							px: 1,
							justifyContent: "space-between",
							width: "140px",
						}}
					>
						<Typography
							sx={{
								color: row.original.isapproved ? "#8AC58A" : "red",
								fontSize: "13px",
							}}
						>
							&#10003; {row.original.isapproved ? "Active" : "Inactive"}
						</Typography>
						<Switch
							checked={row.original.isapproved}
							onChange={handleChange(row.index)}
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
			{
				accessorKey: "action",
				header: "Action",
				size: 120,
				Cell: ({ row }) => (
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<IconButton onClick={() => handleClickOpen(row.original)}>
							<VisibilityIcon sx={{ color: "#111" }} />
						</IconButton>
						<IconButton onClick={() => handleDelete(row.original.id)}>
							<DeleteIcon sx={{ color: "red" }} />
						</IconButton>
						<Button
							sx={{
								bgcolor: row.original.isapproved ? "#00ABFF" : "lightgray",
								textTransform: "capitalize",
								fontSize: "13px",
								color: "#fff",
								":hover": {
									bgcolor: row.original.isapproved ? "#6FB776" : "gray",
								},
							}}
						>
							{row.original.isapproved ? "Approved" : "Approve"}
						</Button>
					</Box>
				),
			},
		],
		[data]
	);

	const table = useMaterialReactTable({
		columns,
		data,
	});

	return (
		<Box
			sx={{
				bgcolor: "#fff",
				mr: 1,
				ml: 2,
				minHeight: "85vh",
				p: 3,
				borderRadius: 1,
				boxShadow: 3,
			}}
		>
			<Typography sx={{ marginBottom: 1.2, fontWeight: "bold", color: "#666" }}>
				List of owners
			</Typography>
			<Box width={"100%"}>
				<MaterialReactTable
					table={table}
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

			{selectedOwner && (
				<Dialog open={open} onClose={handleClose} fullWidth>
					<DialogTitle>Owner Details</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							label="Owner"
							type="text"
							fullWidth
							variant="outlined"
							value={selectedOwner.name}
							InputProps={{
								readOnly: true,
							}}
						/>
						<TextField
							margin="dense"
							label="Email"
							type="email"
							fullWidth
							variant="outlined"
							value={selectedOwner.email}
							InputProps={{
								readOnly: true,
							}}
						/>
						<TextField
							margin="dense"
							label="Phone"
							type="text"
							fullWidth
							variant="outlined"
							value={selectedOwner.phone}
							InputProps={{
								readOnly: true,
							}}
						/>
						<TextField
							margin="dense"
							label="Location"
							type="text"
							fullWidth
							variant="outlined"
							value={selectedOwner.location}
							InputProps={{
								readOnly: true,
							}}
						/>
						<TextField
							margin="dense"
							label="Uploaded Books"
							type="text"
							fullWidth
							variant="outlined"
							value={selectedOwner.upload}
							InputProps={{
								readOnly: true,
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Box>
	);
};

export default Owners;
