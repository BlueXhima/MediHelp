const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');

// Update User Endpoint
router.put('/update-user/:email', async (req, res) => {
    const { email } = req.params;
    const { FirstName, LastName, Email, Password } = req.body;

    console.log("Debug: Received PUT request to /update-user/:email");
    console.log("Debug: Request params - email:", email);
    console.log("Debug: Request body -", { FirstName, LastName, Email, Password });

    if (!FirstName || !LastName || !Email || !Password) {
        console.log("Debug: Missing required fields in request body");
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Hash the password
        console.log("Debug: Hashing password");
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Update user in the database
        const query = `UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Password = ? WHERE Email = ?`;
        const values = [FirstName, LastName, Email, hashedPassword, email]; // 'email' dito ay yung req.params.email (Old Email)

        console.log("Debug: Executing query -", query);
        console.log("Debug: Query values -", values);

        dbconnection.query(query, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error." });
            }

            console.log("Debug: Query result -", result);

            if (result.affectedRows === 0) {
                console.log("Debug: No user found with the provided email");
                return res.status(404).json({ message: "User not found." });
            }

            console.log("Debug: User updated successfully");
            res.status(200).json({ message: "User updated successfully." });
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "An error occurred while updating the user." });
    }
});

module.exports = router;