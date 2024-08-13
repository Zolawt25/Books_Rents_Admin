import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import Books from "./pages/Books";
import Owners from "./pages/Owners";
import BookUpload from "./pages/BookUpload";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function App() {
	const location = window.location.href.split("/")[3];
	const [isDisable, setIsDisable] = useState(false);
	const cookie = new Cookies();
	const navigate = useNavigate();
	const locationName = useLocation().pathname;

	useEffect(() => {
		if (!cookie.get("user_token") && !sessionStorage.getItem("user_token")) {
			if (locationName !== "/signup" && locationName !== "/login") {
				console.log("zzz");
				navigate("/login");
				window.location.reload();
			}
		}
	}, []);

	useEffect(() => {
		if (location === "login") {
			setIsDisable(true);
		} else if (location === "signup") {
			setIsDisable(true);
		} else {
			setIsDisable(false);
		}
	}, [isDisable]);

	return (
		<Box sx={{ display: "flex" }}>
			<Sidebar />
			<Box width={"100%"}>
				<Box
					sx={{
						height: "90px",
						display: `${isDisable ? "none" : "block"}`,
					}}
				></Box>
				<Routes>
					<Route path="*" element={<HomePage />} />
					<Route path="/books" element={<Books />} />
					<Route path="/Book_Upload" element={<BookUpload />} />
					<Route path="/owners" element={<Owners />} />
					<Route path="/login" element={<LogIn />} />
					<Route path="/signup" element={<SignUp />} />
				</Routes>
			</Box>
		</Box>
	);
}

export default App;
