const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/signupDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("MongoDB Connected") })
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedMovies: [{ type: String }]
});

const movieSchema = new mongoose.Schema({
    imdbID: { type: String, unique: true },
    title: String,
    votes: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);
const Movie = mongoose.model("Movie", movieSchema);

app.post("/api/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exists' });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: "Invalid User Credentials" });
        }
        // Assuming you return the user's email upon successful login
        res.status(200).json({ message: "Login Successful", email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.get("/api/movie/:imdbID", async (req, res) => {
    try {
        const movie = await Movie.findOne({ imdbID: req.params.imdbID });
        res.json(movie || { imdbID: req.params.imdbID, votes: 0 });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving movie details" });
    }
});

// Toggle movie like for a user
app.post('/api/movies/vote', async (req, res) => {
    const { imdbID, title, email } = req.body; // Use email instead of userId
  
    try {
      // Find the movie in the database or create it if it doesn't exist
      let movie = await Movie.findOne({ imdbID });
      if (!movie) {
        movie = new Movie({ imdbID, title, votes: 0 }); // Start with 0 votes
      }
  
      // Find the user by email and toggle the like
      const user = await User.findOne({ email }); // Update to find by email
      if (user) {
        const movieIndex = user.likedMovies.indexOf(imdbID);
        if (movieIndex === -1) {
          // Add like if not liked
          user.likedMovies.push(imdbID);
          // Increment votes using arrow function
          movie.votes = (() => movie.votes + 1)();
        } else {
          // Remove like if already liked
          user.likedMovies.splice(movieIndex, 1);
          // Decrement votes using arrow function
          movie.votes = (() => movie.votes - 1)();
        }
        await user.save();
        await movie.save();
        res.json({ votes: movie.votes, liked: movieIndex === -1 });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: "Error voting for the movie" });
    }
});



// Fetch liked movies for a user
app.get('/api/users/:email/likedMovies', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        res.json(user ? user.likedMovies : []);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching liked movies' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
