const expressAsyncHandler = require('express-async-handler');
const User = require('../models/Users');
const Admin = require('../models/admin');

const adminController = {
    // Grant access to a user
    grantAccess: expressAsyncHandler(async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.accessGranted = true;
            await user.save();

            return res.status(200).json({ message: 'Access granted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }),

    // Change user role
    changeUserRole: expressAsyncHandler(async (req, res) => {
        const { userId } = req.params;
        const { newRole } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.role = newRole;
            await user.save();

            return res.status(200).json({ message: 'User role updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }),

    // Other admin actions (placeholders)
    // Add more actions as needed
    createChat: expressAsyncHandler(async (req, res) => {
        // Your implementation to create a chat
    }),

    deleteChat: expressAsyncHandler(async (req, res) => {
        // Your implementation to delete a chat
    }),

    // Placeholder for fetching all users
    fetchAllUsers: expressAsyncHandler(async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }),

    // Placeholder for fetching a specific user
    fetchUser: expressAsyncHandler(async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    })
};

module.exports = adminController;
