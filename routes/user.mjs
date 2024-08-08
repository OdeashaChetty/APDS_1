import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

// Initialize brute force protection
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

// Sign up route
router.post("/signup", async (req, res) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Prepare the new user document
        let newDocument = {
            name: req.body.name,
            password: hashedPassword
        };

        // Insert new user into the database
        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);

        // Respond with success status
        res.status(201).send(result); // 201 Created
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Login route
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;
    
    try {
        // Find user by name
        const collection = await db.collection("users");
        const user = await collection.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Compare provided password with hashed password in database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Generate JWT token on successful authentication
        const token = jwt.sign({ name: user.name }, "your_secret_key_here", { expiresIn: "10h" });

        // Respond with success status and token
        res.status(200).json({ message: "Authentication successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

export default router;
