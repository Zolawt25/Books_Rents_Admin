import { useState } from "react";
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
import { z } from "zod";
import Cookies from "universal-cookie";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LogIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const cookie = new Cookies();
	const navigate = useNavigate();

	const handleLogin = async () => {
		// Validate input
		const validationResult = loginSchema.safeParse({ email, password });
		if (!validationResult.success) {
			setErrors(validationResult.error.flatten().fieldErrors);
			return;
		}

		try {
			setIsLoading(true);
			const response = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/accounts/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);
			setIsLoading(false);

			if (!response.ok) {
				const errorData = await response.json();
				// Assuming your API returns an error message in the response
				if (errorData.message === "Incorrect password") {
					setErrors({ password: ["Incorrect password"] });
				} else {
					throw new Error(errorData.message || "Login failed");
				}
			} else {
				const data = await response.json();
				rememberMe
					? cookie.set("user_token", data.token)
					: sessionStorage.setItem("user_token", data.token);
				navigate("/");
				window.location.reload();
			}
		} catch (error) {
			setErrors({ general: error.message });
		}
	};
	console.log(rememberMe);
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
					alt="Login Page Image"
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
						marginBottom: 2,
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
					/>
					Book Rent
				</Typography>
				<Typography variant="h6" sx={{ paddingY: 1 }}>
					Login
				</Typography>
				<Divider sx={{ marginBottom: 3 }} />

				{errors.general && (
					<Typography
						color="error"
						variant="body2"
						sx={{ mb: 3, textAlign: "center" }}
					>
						{errors.general}
					</Typography>
				)}

				<TextField
					id="outlined-basic"
					label="Email address"
					variant="outlined"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={!!errors.email}
					helperText={errors.email?.[0]}
				/>

				<TextField
					id="outlined-password"
					label="Password"
					variant="outlined"
					sx={{ marginY: 2 }}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					error={!!errors.password}
					helperText={errors.password?.[0]}
				/>

				<Typography>
					<Checkbox
						checked={rememberMe}
						onChange={(e) => setRememberMe(e.target.checked)}
					/>{" "}
					Remember me
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
					onClick={isLoading === false && handleLogin}
				>
					{isLoading ? "Logging in..." : "Login"}
				</Button>
				<Typography sx={{ textAlign: "center", marginTop: 2 }}>
					Don't have an account?{" "}
					<Link href="/signup" sx={{ textDecoration: "none" }}>
						Sign up
					</Link>
				</Typography>
			</Box>
		</Box>
	);
};

export default LogIn;
