import React, { useState } from "react";
import {
	Modal,
	Box,
	Typography,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import axios from "axios";

const EditBookModal = ({ open, onClose, book, onSave }) => {
	const [formData, setFormData] = useState(book);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSave = () => {
		axios
			.put(
				`${import.meta.env.VITE_SERVER_URL}/books/${formData.bookno}`,
				formData
			)
			.then((response) => {
				onSave(response.data); // Update the table data
				onClose(); // Close the modal
			})
			.catch((error) => {
				console.error("Error updating book:", error);
			});
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 400,
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 4,
					borderRadius: 2,
				}}
			>
				<Typography variant="h6" mb={2}>
					Edit Book
				</Typography>
				<TextField
					label="Book No"
					name="bookno"
					value={formData.bookno}
					onChange={handleChange}
					fullWidth
					margin="normal"
					disabled
				/>
				<TextField
					label="Book Name"
					name="bookname"
					value={formData.bookname}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Owner"
					name="owner"
					value={formData.owner}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<FormControl fullWidth margin="normal">
					<InputLabel>Category</InputLabel>
					<Select
						name="category"
						value={formData.category}
						onChange={handleChange}
					>
						<MenuItem value="fiction">Fiction</MenuItem>
						<MenuItem value="non-fiction">Non-Fiction</MenuItem>
						<MenuItem value="self-help">Self-Help</MenuItem>
						<MenuItem value="business">Business</MenuItem>
					</Select>
				</FormControl>
				<TextField
					label="Price"
					name="price"
					type="number"
					value={formData.price}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Quantity"
					name="quantity"
					type="number"
					value={formData.quantity}
					onChange={handleChange}
					fullWidth
					margin="normal"
				/>
				<FormControl fullWidth margin="normal">
					<InputLabel>Status</InputLabel>
					<Select name="status" value={formData.status} onChange={handleChange}>
						<MenuItem value={true}>Free</MenuItem>
						<MenuItem value={false}>Rented</MenuItem>
					</Select>
				</FormControl>
				<Button variant="contained" color="primary" onClick={handleSave}>
					Save
				</Button>
			</Box>
		</Modal>
	);
};

export default EditBookModal;
