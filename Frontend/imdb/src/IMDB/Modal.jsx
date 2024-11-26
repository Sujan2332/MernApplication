import React, { useEffect, useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, imdbID }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(imdbID)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (isOpen && imdbID) {
        setLoading(true);
        try {
          const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=70731d2`);
          const data = await response.json();
          setMovie(data);
        } catch (error) {
          console.error('Error fetching movie details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMovieDetails();
  }, [isOpen, imdbID]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          movie && (
            <>
              <h2 id="title" style={{textDecoration:"underline"}}>{movie.Title}</h2>
              <div style={{ border: "15px solid white", borderRadius: "20px", width: "auto", background: "white", margin: "10px 0px " }}>
                <img
                  id="poster"
                  src={movie.Poster === "N/A" ? "https://media.tenor.com/IHdlTRsmcS4AAAAM/404.gif" : movie.Poster}
                  alt={movie.Title}
                />
              </div>
              <h3 id="plot"><strong>Plot:</strong> {movie.Plot}</h3>
              <p id="year"><strong>Year:</strong> {movie.Year}</p>
              <p id="rated"><strong>Rated:</strong> {movie.Rated}</p>
              <p id="released"><strong>Released:</strong> {movie.Released}</p>
              <p id="runtime"><strong>Runtime:</strong> {movie.Runtime}</p>
              <p id="genre"><strong>Genre:</strong> {movie.Genre}</p>
              <p id="director"><strong>Director:</strong> {movie.Director}</p>
              <p id="writer"><strong>Writer:</strong> {movie.Writer}</p>
              <p id="actors"><strong>Actors:</strong> {movie.Actors}</p>
              <p id="language"><strong>Language:</strong> {movie.Language}</p>
              <p id="country"><strong>Country:</strong> {movie.Country}</p>
              <p id="awards"><strong>Awards:</strong> {movie.Awards}</p>
              <p id="boxoffice"><strong>Box Office:</strong> {movie.BoxOffice}</p>
              <p id="production"><strong>Production:</strong> {movie.Production}</p>
              <p id="website"><strong>Website:</strong> <a href={movie.Website} target="_blank" rel="noopener noreferrer">{movie.Website}</a></p>
              <p id="imdbRating"><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
              <p id="imdbVotes"><strong>IMDB Votes:</strong> {movie.imdbVotes}</p>
              <p id="metascore"><strong>Metascore:</strong> {movie.Metascore}</p>
              <ul id="ratings">
                <p><strong style={{textDecoration:"underline"}}>Ratings :</strong> </p>
                {movie.Ratings && movie.Ratings.map((rating, index) => (
                  <li key={index}>
                    <strong>{rating.Source}:</strong> {rating.Value}
                  </li>
                ))}
              </ul>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Modal;
