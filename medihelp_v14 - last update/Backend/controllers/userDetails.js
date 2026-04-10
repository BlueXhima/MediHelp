const express = require('express');
const router = express.Router();
const dbconnection = require('../config/db');

// Fetch User Details Endpoint
router.get('/user-details', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const [users] = await dbconnection.query(
            'SELECT UserID, FirstName, LastName, Email, profile_picture FROM users WHERE Email = ?',
            [email]
        );

        if (users.length > 0) {
            const user = users[0];
            return res.json({ 
                userID: user.UserID, 
                firstName: user.FirstName, 
                lastName: user.LastName, 
                email: user.Email,
                profile_picture: user.profile_picture 
            });
        }

        return res.status(404).json({ error: 'User not found' });

    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ error: 'An error occurred while fetching user details' });
    }
});

// Update Profile Endpoint
// router.put('/update-profile', async (req, res) => {
//     const { 
//         userId, firstName, lastName, phone, address, 
//         gender, height, weight, bloodType, dob 
//     } = req.body;

//     if (!userId) {
//         return res.status(400).json({ error: 'User ID is required' });
//     }

//     try {
//         const query = `
//             UPDATE users 
//             SET 
//                 FirstName = ?, 
//                 LastName = ?, 
//                 phone = ?, 
//                 address = ?, 
//                 gender = ?, 
//                 height = ?, 
//                 weight = ?, 
//                 bloodType = ?, 
//                 dob = ?,
//                 Updated_Date = CURDATE(),
//                 Updated_Time = CURTIME()
//             WHERE UserID = ?
//         `;

//         const values = [
//             firstName || null, 
//             lastName || null, 
//             phone || null, 
//             address || null, 
//             gender || null, 
//             height || null, 
//             weight || null, 
//             bloodType || null, 
//             dob || null, 
//             userId // Ito dapat ang huli para sa WHERE clause
//         ];

//         const [result] = await dbconnection.query(query, values);

//         // 3. I-check kung may na-update talagang row
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'User not found or no changes made' });
//         }

//         res.json({ message: 'Profile updated successfully!' });
//     } catch (error) {
//         console.error('Error updating profile:', error);
//         res.status(500).json({ error: 'An error occurred while updating profile' });
//     }
// });

module.exports = router;