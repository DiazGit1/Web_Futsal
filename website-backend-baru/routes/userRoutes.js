const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

// Aturan validasi
const registerValidation = [
  body('fullName', 'Nama lengkap wajib diisi').notEmpty(),
  body('email', 'Email tidak valid').isEmail(),
  body('password', 'Password minimal 6 karakter').isLength({ min: 6 }),
  handleValidationErrors,
];

const loginValidation = [
  body('email', 'Email wajib diisi').isEmail(),
  body('password', 'Password wajib diisi').exists(),
  handleValidationErrors,
];

// Endpoint
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

module.exports = router;