import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import './Movie.css'; 
const MovieSearch = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [likedMovies, setLikedMovies] = useState([]);
   const [selectedMovie, setSelectedMovie] = useState(null); // State for the selected movie
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate()

  const user = localStorage.getItem("userEmail");
  // console.log(user)
  useEffect(() => {
    // Fetch user liked movies on login
    const fetchLikedMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/likedMovies`);
        if (!response.ok) {
          throw new Error('Failed to fetch liked movies');
        }
        const data = await response.json();
        setLikedMovies(data);
      } catch (error) {
        console.error('Error fetching liked movies:', error);
      }
    };

    if (userId) {
      fetchLikedMovies();
    }
  }, [userId]);

  const fetchMovies = async (query, page) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=70731d2&page=${page}&s=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movies from OMDb API.");
      }
      const data = await response.json();

      if (data.Response === 'True') {
        const moviesWithVotes = await Promise.all(
          data.Search.map(async (movie) => {
            try {
              const voteResponse = await fetch(`http://localhost:5000/api/movie/${movie.imdbID}`);
              if (!voteResponse.ok) {
                throw new Error(`Failed to fetch votes for ${movie.Title}`);
              }
              const voteData = await voteResponse.json();
              return {
                ...movie,
                votes: voteData.votes || 0,
                liked: likedMovies.includes(movie.imdbID)
              };
            } catch (error) {
              console.error("Error fetching movie votes:", error);
              return { ...movie, votes: 0, liked: likedMovies.includes(movie.imdbID) };
            }
          })
        );
        setMovies(moviesWithVotes);
        setError('');
      } else {
        setMovies([]);
        setError(data.Error || 'No results found.');
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError('An error occurred while fetching data from OMDb API.');
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchMovies(searchQuery, 1);
      setPage(1);
    }
  };

  const handleVote = async (movie) => {
    try {
      const userEmail = localStorage.getItem("userEmail");
  
      if (!userEmail) {
        console.error("Error: userEmail is not defined");
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/movies/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imdbID: movie.imdbID, title: movie.Title, email: userEmail })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMovies((prevMovies) =>
          prevMovies.map((m) =>
            m.imdbID === movie.imdbID 
              ? { ...m, votes: data.votes, liked: data.liked } 
              : m
          )
        );
  
        setLikedMovies((prevLikedMovies) =>
          data.liked
            ? [...prevLikedMovies, movie.imdbID]
            : prevLikedMovies.filter((id) => id !== movie.imdbID)
        );
      } else {
        console.error(data.error || "Error toggling vote");
      }
    } catch (error) {
      console.error("Error voting for the movie:", error);
    }
  };

  const openModal = (movie) => {
    console.log("Opening modal for:", movie); // Debugging line
    setSelectedMovie(movie); // Set the selected movie
    setIsModalOpen(true); // Open the modal
  };
  

  const closeModal = () => {
    console.log("Closing modal"); // Debugging line
    setIsModalOpen(false); // Close the modal
    setSelectedMovie(null); // Clear the selected movie
  };

  const login = ()=>{
    navigate("/login")
  }

  const sign = ()=>{
    navigate("/")
  }

  return (
    <div className='main' style={{background:"linear-gradiet(285deg, black,grey"}}>
      <nav style={{position:"relative",display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignItems:"center"}}><h1 style={{marginTop:"25px",marginRight:"auto"}}><span style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", textAlign: 'center', color: 'black' ,cursor:"pointer"}} onClick={sign} >IMDb</span></h1>
      <h2 style={{color:"white",position:"absolute",marginTop:"15px"}}>🌟 Welcome <span style={{textDecoration:"underline"}}>{user.split('@')[0].toUpperCase()}</span> 🌟</h2>
      </nav>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn"type="submit">Search</button>
      </form>

      {error && <p>{error}</p>}
      <div className="movie-cards">
      {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card" onClick={() => openModal(movie)}>
            <h2 style={{textDecoration:"underline"}}>{movie.Title}</h2>
            <img className='image' src={movie.Poster !== 'N/A' ? movie.Poster : 'https://media.tenor.com/IHdlTRsmcS4AAAAM/404.gif'} alt={movie.Title} />
            <h4>Year: {movie.Year}</h4>
            <h4>Votes: {movie.votes}</h4>
            <button
              className={movie.liked ? 'liked' : ''}
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal opening
                handleVote(movie);
              }}
            >
              <i 
              style={movie.liked ? { color: "red",fontSize:"25px" } : {fontSize:"25px",color:"grey"}} 
              className={`fa-solid fa-heart ${movie.liked ? "liked" : ""}`}
              />
            </button>
          </div>
        ))} 
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} imdbID={selectedMovie?.imdbID} />
    </div>
  );
};

export default MovieSearch;
