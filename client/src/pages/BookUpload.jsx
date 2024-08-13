import { useState } from "react";
import axios from "axios";
import {
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Alert,
} from "@mui/material";
import BookUploadComponent from "../components/BookUploadComponent";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { storage } from "../assets/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { z } from "zod";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const bookSchema = z.object({
	name: z.string().min(1, "Book name is required"),
	price: z.string().min(1, "Price is required"),
	category: z.string().min(1, "Category is required"),
	author: z.string().min(1, "Author is required"),
	quantity: z.string().min(1, "Quantity is required"),
});

const BookUpload = () => {
	const [open, setOpen] = useState(false);
	const [book, setBook] = useState({});
	const [imageUpload, setImageUpload] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState([]);
	const randomNum = Math.floor(1000 + Math.random() * 9000);
	const cookie = new Cookies();
	const token = cookie.get("user_token");
	const filteredToken = token ? token : sessionStorage.getItem("user_token");
	const decodedToken = filteredToken ? jwtDecode(filteredToken) : "";
	const owner = decodedToken?.name;
	const navigate = useNavigate();

	const handleSubmit = async () => {
		const result = bookSchema.safeParse(book);
		if (!result.success) {
			const validationErrors = result.error.errors.map((err) => err.message);
			setErrors(validationErrors);
			return;
		}

		if (imageUpload == null) return;

		try {
			setIsLoading(true);
			const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
			const snapshot = await uploadBytes(imageRef, imageUpload);
			const url = await getDownloadURL(snapshot.ref);

			await axios.post(`${import.meta.env.VITE_SERVER_URL}/books`, {
				bookno: randomNum,
				status: true,
				price: book.price,
				category: book.category,
				author: book.author,
				quantity: book.quantity,
				coverimg: url,
				bookname: book.name,
				owner: owner,
			});

			setIsLoading(false);
			setOpen(true);
			setErrors([]);
		} catch (error) {
			setIsLoading(false);
			console.error("Error during submission:", error);
		}
	};

	const handleClose = () => {
		setOpen(false);
		navigate("/");
	};

	return (
		<Box
			sx={{
				boxShadow: 3,
				borderRadius: 3,
				ml: 2,
				mr: 1,
				bgcolor: "#fff",
				minHeight: "84vh",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					p: 6,
				}}
			>
				<Typography color="#777" fontSize={19} mb={3}>
					Upload New Book
				</Typography>

				{/* Display validation errors */}
				{errors.length > 0 && (
					<Box sx={{ mb: 3, width: "100%" }}>
						{errors.map((error, index) => (
							<Alert key={index} severity="error" sx={{ mb: 1 }}>
								{error}
							</Alert>
						))}
					</Box>
				)}

				<BookUploadComponent setBook={setBook} />
				<Box sx={{ mt: 3 }}>
					{imageUpload === null ? (
						<Button
							sx={{
								color: "#00ABFF",
							}}
							component="label"
							startIcon={<FileUploadOutlinedIcon />}
						>
							Upload Book Cover
							<input
								type="file"
								accept="image/*"
								hidden
								onChange={(event) => {
									setImageUpload(event.target.files[0]);
								}}
							/>
						</Button>
					) : (
						<Typography
							sx={{
								color: "green",
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							Image Selected <CheckCircleIcon />
						</Typography>
					)}
				</Box>
				<Button
					sx={{
						bgcolor: `${isLoading ? "lightgray" : "#00ABFF"}`,
						color: "#fff",
						py: 2,
						px: 15,
						mt: 6,
						cursor: `${isLoading ? "not-allowed" : "pointer"}`,
						":hover": {
							color: "#00ABFF",
							bgcolor: `${isLoading ? "lightgray" : "#00aaff44"}`,
						},
					}}
					onClick={isLoading === false && handleSubmit}
				>
					{isLoading ? "Uploading..." : "Submit"}
				</Button>
			</Box>

			{/* Dialog for showing the success message */}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						p: 2,
					}}
				>
					<Box
						component="img"
						src="/submitPopup.png"
						alt="Success"
						sx={{ width: "100px", marginBottom: "20px" }}
					/>

					<DialogTitle
						id="alert-dialog-title"
						sx={{ textAlign: "center", padding: 0 }}
					>
						{"Congrats!"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText
							id="alert-dialog-description"
							sx={{ textAlign: "center" }}
						>
							You have uploaded the book successfully. Wait until we approve it.
						</DialogContentText>
					</DialogContent>
				</Box>
				<DialogActions sx={{ justifyContent: "center" }}>
					<Button
						onClick={handleClose}
						autoFocus
						variant="contained"
						color="primary"
					>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default BookUpload;
