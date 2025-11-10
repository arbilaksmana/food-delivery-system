const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fungsi untuk Registrasi Pengguna Baru
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Cek apakah email sudah terdaftar
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email already exists" });
    }

    // Buat pengguna baru
    const user = await User.create({
      name,
      email,
      password,
      address,
    });

    if (user) {
      res.status(201).json({
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
        },
      });
    } else {
      res.status(400).json({ status: "fail", message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Fungsi untuk Login Pengguna
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari pengguna berdasarkan email
    const user = await User.findOne({ email });

    // Cek pengguna dan bandingkan password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "iae3jwt", {
        expiresIn: "1d", // Durasi token
      });

      res.status(200).json({
        status: "success",
        data: {
          token,
        },
      });
    } else {
      res
        .status(401)
        .json({ status: "fail", message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } else {
      res.status(404).json({ status: "fail", message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
