import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	TextField,
	Checkbox,
	Link,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

const schema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Confirm Password must be at least 6 characters"),
		location: z.string().min(1, "Location is required"),
		phone: z.string().min(10, "Phone number must be at least 10 digits"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const SignUp = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		location: "",
		phone: "",
	});
	const [errors, setErrors] = useState({});
	const [checked, setChecked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleAccept = () => {
		setChecked(!checked);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			schema.parse(formData);
			navigate("/login");
			await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/accounts/register`,
				formData
			);
			alert("User registered successfully!");
			setIsLoading(false);
		} catch (err) {
			if (err instanceof z.ZodError) {
				const formattedErrors = {};
				err.errors.forEach(({ path, message }) => {
					formattedErrors[path[0]] = message;
				});
				setErrors(formattedErrors);
			} else {
				alert("An error occurred. Please try again.");
			}
		}
	};

	return (
		<Box sx={{ width: "100%", display: "flex" }}>
			<Box
				sx={{
					background: "#171B36",
					width: "50%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<Box
					component="img"
					sx={{
						height: 233,
						width: 350,
						maxHeight: { xs: 233, md: 167 },
						maxWidth: { xs: 350, md: 250 },
					}}
					alt="Sign up Page Image"
					src="loginLogo.png"
				/>
			</Box>
			<Box
				sx={{
					paddingX: "3%",
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					height: "100vh",
					width: "50%",
				}}
			>
				<Typography
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						marginBottom: 1,
					}}
					variant="h5"
				>
					<Box
						component="img"
						sx={{
							height: 28,
							width: 40,
						}}
						alt="login icon"
						src="loginIcon.png"
					/>{" "}
					Book Rent
				</Typography>
				<Typography variant="h6" sx={{ paddingY: 1, color: "#555" }}>
					Sign Up as Owner
				</Typography>
				<Divider sx={{ marginBottom: 3 }} />
				<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
					<TextField
						label="Name"
						variant="outlined"
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						error={!!errors.name}
						helperText={errors.name}
					/>
					<TextField
						label="Email address"
						variant="outlined"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						error={!!errors.email}
						helperText={errors.email}
					/>
					<TextField
						label="Password"
						variant="outlined"
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						error={!!errors.password}
						helperText={errors.password}
					/>
					<TextField
						label="Confirm Password"
						variant="outlined"
						type="password"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword}
					/>
					<TextField
						label="Location"
						variant="outlined"
						type="text"
						name="location"
						value={formData.location}
						onChange={handleChange}
						error={!!errors.location}
						helperText={errors.location}
					/>
					<TextField
						label="Phone Number"
						variant="outlined"
						type="number"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						error={!!errors.phone}
						helperText={errors.phone}
					/>
				</Box>

				<Typography>
					<Checkbox onClick={handleAccept} /> I accept the Terms and Conditions.
				</Typography>

				<Button
					sx={{
						background: `${isLoading ? "lightgray" : "#00ABFF"}`,
						cursor: `${isLoading ? "not-allowed" : "pointer"}`,
						color: "#fff",
						":hover": {
							bgcolor: `${isLoading ? "lightgray" : "#446497"}`,
						},
					}}
					disabled={!checked}
					onClick={isLoading === false && handleSubmit}
				>
					{isLoading ? "signing up..." : "Sign Up"}
				</Button>
				<Typography sx={{ textAlign: "center", marginTop: 2 }}>
					Already have an account?{" "}
					<Link href="/login" sx={{ textDecoration: "none" }}>
						Login
					</Link>
				</Typography>
			</Box>
		</Box>
	);
};

export default SignUp;
