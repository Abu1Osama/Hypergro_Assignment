import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Loader from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowDown } from "@fortawesome/free-solid-svg-icons";

interface VideoPlayerProps {}

function Reel(props: VideoPlayerProps): JSX.Element {

  interface Comment {
    id: number;
    text: string;
  }
  interface Movie {
    postId: string;
    creator: {
      name?: string;
      handle: string;
      id: string;
    };
    submission: {
      title: string;
      description: string;
      mediaUrl: string;
      thumbnail: string;
      hyperlink: string;
      placeholderUrl: string;
    };
    comment: {
      count: number;
    };
    reaction: {
      count: number;
    };
  }
  const [movies, setMovies] = useState<Movie[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<ReactPlayer | null>(null);

  async function fetchData(pageNumber) {
    const url = `https://internship-service.onrender.com/videos?page=${pageNumber}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from page ${pageNumber}. Status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function fetchAllPages() {
    let allData: Movie[] = [];

    let currentPage = 0;

    while (true) {
      const data = await fetchData(currentPage);

      if (data) {
        const posts = data.data.posts;
        if (posts.length === 0) {
          break;
        }

        allData = allData.concat(posts);
        currentPage++;
      } else {
        break;
      }
    }

    return allData;
  }

  useEffect(() => {
    const fetchDataAndInitialize = async () => {
      setIsLoading(true);
      const allData = await fetchAllPages();
      setIsLoading(false);
      setMovies(allData);
    };

    fetchDataAndInitialize();
  }, []);

  const playNextVideo = () => {
    if (movies && movies.length > 0) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % movies.length);
      setIsPlaying(true);
    }
  };

  return (
    <div className=" relative w-96 m-auto mt-5" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", height: "650px", display: "flex", flexDirection: "column", }}>
      <div className="video-section p-4">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="player relative rounded-xl pt-[56.25%]">
            {movies && movies.length > 0 && (
              <div>
                <ReactPlayer
                  ref={videoRef}
                  preload="auto"
                  url={
                    movies && movies[currentVideoIndex]
                      ? movies[currentVideoIndex].submission.mediaUrl
                      : ""
                  }
                  width="350px"
                  height="600px"
                  playing={isPlaying}
                  controls={true}
                  className="react-player absolute top-0 left-0"
                  onEnded={playNextVideo}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-14 right-0  flex justify-center  items-center p-5">
        <button className="z-50">
          <FontAwesomeIcon icon={faArrowDown}  onClick={playNextVideo} className="p-5 border rounded-full bg-green-600"/>
        </button>
      </div>
    </div>
  );
}

export default Reel;
