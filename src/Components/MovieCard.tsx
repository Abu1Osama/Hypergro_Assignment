import React, { useState } from "react";
import { Link } from "react-router-dom";

interface MovieCardProps {
  item: {
    postId: string;
    creator: {
      name?: string;
      handle: string;
    };
    submission: {
      thumbnail: string;
      title: string;
      description: string;
    };
  };
}

function MovieCard({ item }: MovieCardProps): JSX.Element {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const isSelectedMovie = (movieId: string) => {
    return movieId === selectedMovieId;
  };

  const handleMovieHover = (movieId: string) => {
    setSelectedMovieId(movieId);
  };

  return (
    <Link to={`/videoplayers?video_id=${item.postId}`}>
      <div
        style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
        className={`relative movie p-3 ${isSelectedMovie(item.postId) ? "selected" : ""
          }`}
        onMouseEnter={() => handleMovieHover(item.postId)}
        onMouseLeave={() => setSelectedMovieId(null)}
      >
        <div className="rounded-lg overflow-hidden">
          <img
            src={item.submission.thumbnail}
            alt=""
            className="w-64 h-64 object-fill sm:object-cover m-auto  "
          />
        </div>
        <div className="p-2">
          <p className="text-lg font-semibold">{item.submission.title}</p>
          <p className="text-gray-600">
            Creator: {item.creator.name ? item.creator.name : item.creator.handle}
          </p>
        </div>
        {isSelectedMovie(item.postId) && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-lg bg-opacity-75 bg-gray-800 "></div>
            <p className="text-white text-sm p-4 z-10">
              {item.submission.description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;
