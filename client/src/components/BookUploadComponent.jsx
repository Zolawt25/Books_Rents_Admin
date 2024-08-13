import { useEffect, useState } from "react";
import {
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	TextField,
	Button,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const PrimaryMenuItem = styled(MenuItem)(({ theme }) => ({
	color: theme.palette.primary.main,
	"&:hover": {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.primary.contrastText,
	},
}));

const BookUploadComponent = ({ setBook, books }) => {
	const [selectedBook, setSelectedBook] = useState("");
	const [open, setOpen] = useState(false);
	const [newBook, setNewBook] = useState({
		name: "",
		author: "",
		category: "",
		quantity: null,
		price: null,
	});

	const handleSelectChange = (event) => {
		const value = event.target.value;
		if (value === "add") {
			setOpen(true);
		} else {
			setSelectedBook(value);
		}
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAddBook = () => {
		setSelectedBook(newBook.name);
		handleClose();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewBook({ ...newBook, [name]: value });
	};
	useEffect(() => {
		setBook(newBook);
	}, [newBook]);

	return (
		<Box>
			<Box
				sx={{
					width: "100%",
					mb: 3,
				}}
			>
				<FormControl fullWidth>
					<InputLabel id="book-select-label">
						Search book by name or Author
					</InputLabel>
					<Select
						labelId="book-select-label"
						id="book-select"
						value={selectedBook}
						label="Search book by name or Author"
						onChange={handleSelectChange}
						displayEmpty
					>
						{newBook.name && (
							<MenuItem value={newBook.name}>{newBook.name}</MenuItem>
						)}
						<PrimaryMenuItem value="add">
							<ListItemText primary="Add New Book" />
						</PrimaryMenuItem>
					</Select>
				</FormControl>
			</Box>

			{/* Dialog for adding a new book */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add a New Book</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						name="name"
						label="Book Name"
						fullWidth
						value={newBook.name}
						onChange={handleInputChange}
					/>
					<TextField
						margin="dense"
						name="author"
						label="Author Name"
						fullWidth
						value={newBook.author}
						onChange={handleInputChange}
					/>
					<FormControl fullWidth margin="dense">
						<InputLabel id="category-select-label">Category</InputLabel>
						<Select
							labelId="category-select-label"
							name="category"
							value={newBook.category}
							onChange={handleInputChange}
							label="Category"
						>
							<MenuItem value="fiction">Fiction</MenuItem>
							<MenuItem value="business">Business</MenuItem>
							<MenuItem value="selfhelp">SelfHelp</MenuItem>
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleAddBook} color="primary">
						Add
					</Button>
				</DialogActions>
			</Dialog>

			{/* Additional inputs */}
			<Box sx={{ width: "700px", display: "flex", gap: 2 }}>
				<FormControl fullWidth>
					<TextField
						margin="dense"
						label="Book Quantity"
						type="number"
						fullWidth
						name="quantity"
						value={newBook.quantity}
						onChange={handleInputChange}
					/>
				</FormControl>
				<TextField
					margin="dense"
					label="Rent price for 2 weeks"
					type="number"
					name="price"
					fullWidth
					value={newBook.price}
					onChange={handleInputChange}
				/>
			</Box>
		</Box>
	);
};

export default BookUploadComponent;
