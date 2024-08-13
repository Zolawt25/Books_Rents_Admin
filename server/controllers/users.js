const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//
//
//
//
//
//
//

const getUsers = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM users");
		const users = result.rows;

		res.status(200).json(users);
	} catch (err) {
		console.error(err.message);
		res
			.status(500)
			.json({ error: "An error occurred while fetching the users" });
	}
};

const register = async (req, res) => {
	const {
		location,
		email,
		password,
		phone,
		isadmin,
		name,
		status,
		isapproved,
	} = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		// Check if the email already exists
		const checkUser = await pool.query(
			"SELECT s FROM users s WHERE s.email = $1",
			[email]
		);
		if (checkUser.rows.length > 0) {
			return res.status(400).json({ error: "Email already exists" });
		}

		// Insert the new user with default values for status and isApproved
		const newUser = await pool.query(
			`INSERT INTO users 
      (location, email, password, phone, isadmin, name, status, isApproved) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
			[
				location,
				email,
				hashedPassword,
				phone,
				isadmin || false,
				name,
				status || false,
				isapproved || false,
			]
		);

		const user = newUser.rows[0];

		// Create a JWT token
		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				location: user.location,
				phone: user.phone,
				isadmin: user.isadmin,
				name: user.name,
				status: user.status,
				isApproved: user.isApproved,
			},
			"wlenjwef84fn348f48938nujfn",
			{ expiresIn: "30d" }
		);

		// Send the response
		res.status(201).json({ user, token });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "An error occurred during registration" });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	const result = await pool.query("SELECT * FROM users WHERE email = $1", [
		email,
	]);
	const user = result.rows[0];
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({ error: "Invalid email or password" });
	}
	const token = jwt.sign(
		{
			id: user.id,
			name: user.name,
			email: user.email,
			location: user.location,
			phone: user.phone,
			isadmin: user.isadmin,
			isapproved: user.isapproved,
			status: user.status,
		},
		"wlenjwef84fn348f48938nujfn",
		{ expiresIn: "30d" }
	);
	console.log(user);
	res.json({ user, token });
};

const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json({ msg: "deleted successfully!" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: error.message });
	}
};
module.exports = { register, login, getUsers, deleteUser };
