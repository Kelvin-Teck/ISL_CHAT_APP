const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Grant access to a user
router.post('/grant-access/:userId', adminController.grantAccess);

// Change user role
router.post('/change-role/:userId', adminController.changeUserRole);

// Other admin actions (placeholders)
// Add more routes for other actions as needed
router.post('/create-chat', adminController.createChat);
router.delete('/delete-chat/:chatId', adminController.deleteChat);
router.get('/fetch-all-users', adminController.fetchAllUsers);
router.get('/fetch-user/:userId', adminController.fetchUser);

module.exports = router;
