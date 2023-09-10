import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import Loader from "./Loader";

interface postId {
  postId: string;
}

interface Creator {
  name: string;
  id: string;
  handle: string;
  pic: string;
}

interface Comment {
  count: number;
  commentingAllowed: boolean;
}

interface Reaction {
  count: number;
  voted: boolean;
}

interface Submission {
  title: string;
  description: string;
  mediaUrl: string;
  thumbnail: string;
  hyperlink: string;
  placeholderUrl: string;
}

interface Movie {
  postId: string;
  creator: Creator;
  comment: Comment;
  reaction: Reaction;
  submission: Submission;
}

function Home(): JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const nextPage = () => {
    if (page < 10) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://internship-service.onrender.com/videos?page=${page}`
      );
      setMovies(response.data.data.posts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  return (
    <div className="flex flex-col justify-center items-center mt-5">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-5 ">
            {movies.map((item: Movie) => (
              <div key={item.postId}>
                <MovieCard item={item} />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex justify-center flex-wrap">
              <button
                onClick={prevPage}
                className="bg-[#1a161f] hover:bg-[#232d2d] text-white font-bold py-2 px-4 rounded mb-2 mr-2"
                disabled={page === 1}
              >
                Previous
              </button>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((pageNumber: number) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`${
                    page === pageNumber
                      ? "bg-[#232d2d] text-white"
                      : `bg-[#1a161f] hover:bg-[#232d2d] text-white hover:text-white`
                  } font-bold py-2 px-4 rounded mb-2 mr-2`}
                >
                  {pageNumber + 1}
                </button>
              ))}
              <button
                onClick={nextPage}
                className="bg-[#1a161f] hover:bg-[#232d2d] text-white font-bold py-2 px-4 rounded mb-2"
                disabled={page === 9}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
