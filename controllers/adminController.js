import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/adminModel.js";

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// ✅ Add dummy admin at server start (runs only once)
const insertDummyAdmin = async () => {
    try {
        const existing = await userModel.findOne({ email: "a@gmail.com" });
        if (!existing) {
            const hashedPassword = await bcrypt.hash("a", 10);
            await userModel.create({
                name: "Ravi Kumar",
                email: "a@gmail.com",
                password: hashedPassword,
                name_of_the_shop: "a1"
            });
            console.log("✅ Dummy admin inserted.");
        } else {
            console.log("ℹ️ Dummy admin already exists.");
        }
    } catch (err) {
        console.error("❌ Failed to insert dummy admin:", err.message);
    }
};

// Immediately run dummy admin insert
insertDummyAdmin();

// ✅ Login Admin
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔐 Admin Login Attempt");

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        // ✅ Secure cookie setup
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ success: true, message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Register Admin
const registerAdmin = async (req, res) => {
    const { name, email, password, name_of_the_shop } = req.body;

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            name_of_the_shop
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        // ✅ Secure cookie setup
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: "Registration successful" });
    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginAdmin, registerAdmin };
