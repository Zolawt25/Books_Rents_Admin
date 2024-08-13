import React, { useMemo, useEffect, useState } from "react";
import {
	MaterialReactTable,
	useMaterialReactTable,
} from "material-react-table";
import {
	Box,
	Typography,
	IconButton,
	Modal,
	TextField,
	Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { defineAbilitiesFor } from "../../util/abilities.js";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
const BookStatusTable = () => {
	const [data, setData] = useState([]);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [editedBook, setEditedBook] = useState({});
	const cookie = new Cookies();
	const token = cookie.get("user_token");
	const filteredToken = token ? token : sessionStorage.getItem("user_token");
	const decodedToken = filteredToken ? jwtDecode(filteredToken) : "";
	const isAdmin = `${decodedToken.isadmin ? "admin" : "owner"}`;
	const owner = decodedToken.name;
	const [role, setRole] = useState(isAdmin);
	const ability = defineAbilitiesFor(role);

	useEffect(() => {
		axios
			.get(`${import.meta.env.VITE_SERVER_URL}/books`)
			.then((response) => {
				let allData = response.data;
				let filteredData =
					isAdmin === "admin"
						? allData
						: allData.filter((item) => {
								if (item.owner === owner) {
									return item;
								}
						  });
				const fetchedData = filteredData.map((item) => ({
					id: item.id,
					bookNum: (
						<Typography
							sx={{
								background: "#F2F2F2",
								textAlign: "center",
								borderRadius: "4px",
								width: "fit-content",
								px: 2,
							}}
						>
							{item.bookno}
						</Typography>
					),
					nameOrOwner: ability.can("manage", "all") ? (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Box
								component="img"
								src={item.coverimg || "/user.jpg"}
								alt="book_owner"
								width="22px"
								height="22px"
								borderRadius="50%"
							/>
							<Typography>{item.owner}</Typography>
						</Box>
					) : (
						<Typography>{item.bookname}</Typography>
					),
					status: (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Box
								sx={{
									width: 17,
									height: 17,
									background: item.status === true ? "#00ABFF" : "red",
									borderRadius: "100%",
								}}
							></Box>
							<Typography fontSize={13.6}>
								{item.status === true ? "Free" : "Rented"}
							</Typography>
						</Box>
					),
					price: `${item.price} Birr`,
				}));
				setData(fetchedData);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const handleEditClick = (bookId) => {
		const bookToEdit = data.find((book) => book.id === bookId);
		if (bookToEdit) {
			setSelectedBook(bookToEdit);
			setEditedBook({
				bookno: bookToEdit.bookNum.props.children,
				status: bookToEdit.status.props.children[1].props.children === "Free",
				price: parseInt(bookToEdit.price),
				bookname: bookToEdit.nameOrOwner.props.children,
			});
			setEditModalOpen(true);
		}
	};

	const handleEditChange = (field, value) => {
		setEditedBook((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleEditSubmit = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_SERVER_URL}/books/${selectedBook.id}`
			);
			const fetchedValues = response.data;

			const updatedBook = {
				bookno: editedBook.bookno || fetchedValues.bookno,
				status:
					editedBook.status !== undefined
						? editedBook.status
						: fetchedValues.status,
				price: editedBook.price || fetchedValues.price,
				bookname: editedBook.bookname || fetchedValues.bookname,
				owner: fetchedValues.owner,
				author: fetchedValues.author,
				quantity: fetchedValues.quantity,
				coverimg: fetchedValues.coverimg,
				category: editedBook.category || fetchedValues.category,
			};

			await axios.put(
				`${import.meta.env.VITE_SERVER_URL}/books/${selectedBook.id}`,
				updatedBook
			);

			setData((prevData) =>
				prevData.map((book) =>
					book.id === selectedBook.id
						? {
								...book,
								bookNum: (
									<Typography
										sx={{
											background: "#F2F2F2",
											textAlign: "center",
											borderRadius: "4px",
											width: "fit-content",
											px: 2,
										}}
									>
										{updatedBook.bookno}
									</Typography>
								),
								nameOrOwner: <Typography>{updatedBook.bookname}</Typography>,
								status: (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Box
											sx={{
												width: 17,
												height: 17,
												background: updatedBook.status ? "#00ABFF" : "red",
												borderRadius: "100%",
											}}
										></Box>
										<Typography fontSize={13.6}>
											{updatedBook.status ? "Free" : "Rented"}
										</Typography>
									</Box>
								),
								price: `${updatedBook.price} Birr`,
						  }
						: book
				)
			);

			setEditModalOpen(false);
		} catch (error) {
			console.error("Error updating book:", error);
		}
	};

	const handleDelete = async (id) => {
		try {
			window.location.reload();
			await axios.delete(`${import.meta.env.VITE_SERVER_URL}/books/${id}`);
			setData((prevData) => prevData.filter((book) => book.id !== id));
		} catch (error) {
			console.error("Error deleting book:", error);
		}
	};

	const columns = useMemo(
		() =>
			[
				{
					accessorKey: "rowNumber",
					header: "No.",
					size: 10,
					Cell: ({ row }) => row.index + 1,
				},
				{
					accessorKey: "bookNum",
					header: "Book No.",
					size: 30,
				},
				{
					accessorKey: "nameOrOwner",
					header: ability.can("manage", "all") ? "Owner" : "Book Name",
					size: 160,
				},
				{
					accessorKey: "status",
					header: "Status",
					size: 40,
				},
				{
					accessorKey: "price",
					header: "Price",
					size: 20,
				},

				!ability.can("manage", "all") && {
					accessorKey: "actions",
					header: "Action",
					size: 100,
					Cell: ({ row }) => (
						<Box sx={{ display: "flex", gap: 1 }}>
							<IconButton onClick={() => handleEditClick(row.original.id)}>
								<EditIcon />
							</IconButton>
							<IconButton
								sx={{ color: "red" }}
								onClick={() => handleDelete(row.original.id)}
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					),
				},
			].filter(Boolean),
		[data, ability.can("manage", "all")]
	);

	const table = useMaterialReactTable({
		columns,
		data,
	});

	return (
		<>
			<MaterialReactTable table={table} />

			<Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						borderRadius: 2,
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography variant="h6" mb={2}>
						Edit Book Information
					</Typography>
					<TextField
						label="Book No."
						fullWidth
						value={editedBook.bookno}
						onChange={(e) => handleEditChange("bookno", e.target.value)}
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Book Name"
						fullWidth
						value={editedBook.bookname}
						onChange={(e) => handleEditChange("bookname", e.target.value)}
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Status"
						fullWidth
						select
						value={editedBook.status}
						onChange={(e) => handleEditChange("status", e.target.value)}
						sx={{ mb: 2 }}
						SelectProps={{
							native: true,
						}}
					>
						<option value={true}>Free</option>
						<option value={false}>Rented</option>
					</TextField>
					<TextField
						label="Price"
						fullWidth
						value={editedBook.price}
						onChange={(e) => handleEditChange("price", e.target.value)}
						sx={{ mb: 2 }}
					/>

					<Button
						variant="contained"
						color="primary"
						onClick={handleEditSubmit}
						fullWidth
					>
						Save Changes
					</Button>
				</Box>
			</Modal>
		</>
	);
};

export default BookStatusTable;
