const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Mendaftarkan pengguna baru
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Pengguna sudah terdaftar');
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Data pengguna tidak valid');
  }
});

// @desc    Autentikasi pengguna & mendapatkan token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email atau password salah');
  }
});

module.exports = { registerUser, loginUser };