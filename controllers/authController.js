const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !name || !name) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "User Already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, emial: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const id = user._id;

    const updatedData = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    res.json({
      success: true,
      message: "Updated successdully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Interfnal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(404).json({ message: "UserId not found" });
    }
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(user._id);
    res.status(200)
      .json({ success: true, message: "user deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server" });
  }
};

module.exports = {
  updateUser,
  registerUser,
  loginUser,
  deleteUser,
};
