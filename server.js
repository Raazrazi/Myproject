const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const port = 2000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory and connect directory
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'connect')));


// MongoDB Connection
// Using 127.0.0.1 to avoid issues with localhost resolution on some systems
const dbURI = 'mongodb://127.0.0.1:27017/faith_myvis';
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false // Optional for login, required for signup logic if needed
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/read', (req, res) => {
    res.sendFile(path.join(__dirname, 'read.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/members', (req, res) => {
    res.sendFile(path.join(__dirname, 'connect', 'index1.html'));
});


// Sign Up Route
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('<script>alert("User already exists!"); window.location.href="/";</script>');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        console.log('User created:', email);
        res.status(201).send('<script>alert("Account created successfully! Please Log In."); window.location.href="/";</script>');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Error creating account');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check is user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('<script>alert("Invalid email or password"); window.location.href="/";</script>');
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('<script>alert("Invalid email or password"); window.location.href="/";</script>');
        }

        // Success (In a real app, you would set a session or JWT token here)
        console.log('User logged in:', email);
        res.send(`<script>alert("Welcome back, ${user.name || 'User'}!"); window.location.href="/read";</script>`);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error logging in');
    }
});

app.listen(port, function () {
    console.log('Server is running on port', port);
});

