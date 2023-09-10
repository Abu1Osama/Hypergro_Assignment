import ReactPlayer from "react-player";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

interface VideoPlayerProps {
}

function Videoplayer(props: VideoPlayerProps): JSX.Element {
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const video_id = searchParams.get("video_id")!;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [fulldata, setFullData] = useState<Movie | null>(null);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState<Movie[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

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
        // console.log(allData)
        currentPage++;
      } else {
        break;
      }
    }

    return allData;
  }

  const fetchCommentsFromLocalStorage = () => {
    const storedComments = JSON.parse(localStorage.getItem(video_id) ?? "[]");
    if (storedComments) {
      setComments(storedComments);
    }
  };

  const removelocal = useCallback(() => {
    localStorage.removeItem(video_id);
  }, [video_id]);

  useEffect(() => {
    fetchAllPages()
      .then((allData) => {
        const foundMovie = allData.find((post) => post.postId === video_id);

        if (foundMovie) {
          setMovie(foundMovie);

          const creatorId = foundMovie.creator.id;

          const recommended = allData.filter(
            (movie) => movie.creator.id === creatorId
          );
          console.log(recommended);

          const filteredRecommended = recommended.filter(
            (movie) => movie.postId !== video_id
          );

          setRecommendedVideos(filteredRecommended);
        } else {
          console.error("Movie not found");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error ", error);
        setIsLoading(false);
      });
    fetchCommentsFromLocalStorage();
    window.addEventListener("beforeunload", removelocal);

    return () => {
      window.removeEventListener("beforeunload", removelocal);
    };
  }, [video_id, removelocal]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  console.log(recommendedVideos);
  const addComment = () => {
    if (isEditing) {
      if (comment.trim() === "") {
        return;
      }

      const updatedComments = comments.map((c) =>
        c.id === editingCommentId ? { ...c, text: comment } : c
      );

      localStorage.setItem(video_id, JSON.stringify(updatedComments));
      setComments(updatedComments);
      setIsEditing(false);
    } else {
      if (comment.trim() === "") {
        return;
      }

      const newComment: Comment = {
        id: Date.now(),
        text: comment,
      };
      const updatedComments = [...comments, newComment];

      setMovie((prevMovie) => ({
        ...prevMovie!,
        comment: {
          ...prevMovie!.comment,
          count: prevMovie!.comment.count + 1,
        },
      }));

      localStorage.setItem(video_id, JSON.stringify(updatedComments));
      setComments(updatedComments);
    }

    setComment("");
    setEditingCommentId(null);
  };

  const startEditingComment = (commentId) => {
    setEditingCommentId(commentId);
    setIsEditing(true);
    const commentToEdit = comments.find((c) => c.id === commentId);
    if (commentToEdit) {
      setComment(commentToEdit.text);
    }
  };

  const deleteComment = (commentId) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    setMovie((prevMovie) => {
      if (!prevMovie) return null;
      return {
        ...(prevMovie as Movie),
        comment: {
          ...prevMovie!.comment,
          count: prevMovie!.comment.count - 1,
        },
      };
    });

    localStorage.setItem(video_id, JSON.stringify(updatedComments));
    setComments(updatedComments);

    if (editingCommentId === commentId) {
      setComment("");
      setEditingCommentId(null);
    }
  };
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const handleVideoReady = () => {
    setIsVideoReady(true);
  };

  return (
    <div>
      <div className="Videoplayer flex flex-col md:flex-row p-10">
        <div className="video-section flex-1 p-4 mr-4" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }} >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="player relative  rounded-xl pt-[56.25%]  ">
                {movie && (
                  <ReactPlayer
                    preload="auto"
                    url={movie.submission.mediaUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    className="react-player absolute top-0 left-0"
                    onReady={handleVideoReady}
                  />
                )}
              </div>
              {!isVideoReady && <Loader />}
              {movie && (
                <div>
                  <div className="title p-3 text-2xl">
                    {" "}
                    <h3>
                      {movie.submission.title} : ({movie.creator.name})
                    </h3>
                  </div>
                  <div className="content flex gap-4 p-2 text-2xl">
                    <i className="far fa-comment">
                      <span className="ml-3">
                        {movie.comment ? movie.comment.count : 0}
                      </span>
                    </i>
                    <i className="far fa-thumbs-up">
                      <span className="ml-3">
                        {" "}
                        {movie.reaction ? movie.reaction.count : 0}
                      </span>
                    </i>
                  </div>
                  <div className="desc">
                    <p>
                      {movie.submission ? movie.submission.description : ""}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
       

          <div className={`comment-section flex-1 pl-4 m-4 ${isLoading ? "hidden" : ""}`}>
          {isLoading ? null : (
             <div className="comment flex items-center gap-3">
             <div className="user border p-5 rounded-full">
               <i className="far fa-user"></i>
             </div>
             <div>
               <input
                 type="text"
                 placeholder={
                   isEditing ? "Edit your comment" : "Write your comment"
                 }
                 value={comment}
                 onChange={handleCommentChange}
                 className="w-full border-b-2 bg-transparent p-2 mb-3"
               />
               <button onClick={addComment}>
                 {isEditing ? "Save Comment" : "Add Comment"}
               </button>
             </div>
           </div>
          )}
          {isLoading ? null : (
            <div className="comment-data p-5">
              <h3>Comments</h3>
              <div className="comment-list max-h-[450px] overflow-y-auto">
                <ul>
                  {comments.map((c) => (
                    <li key={c.id}>
                      <div className="flex gap-5 items-center mb-3 ">
                        <div className="border rounded-full p-3 border-teal-600">
                          <i className="far fa-user"></i>
                        </div>
                        <div className="grid items-center  justify-normal w-1/2">
                          <div className="grid gap-1">
                            <span className="flex gap-6">
                              {" "}
                              <p>user1234@</p>
                              {timeString}
                            </span>
                            <p>{c.text}</p>
                          </div>
                          <div className="flex gap-5 text-lg">
                            <button onClick={() => deleteComment(c.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                            <button onClick={() => startEditingComment(c.id)}>
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {recommendedVideos.length > 0 && (
        <div className="recommended-videos">
          <h3 className="p-5 text-2xl font-black">Recommended Videos</h3>
          <div  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-5 ">
         
            {recommendedVideos.map((recommendedVideo) => (
              <Link to={`/videoplayers?video_id=${recommendedVideo.postId}`}>
                  <div className="recommended-video-thumbnail "    style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={recommendedVideo.submission.thumbnail}
                        alt=""
                        className="w-64 h-64 object-fill sm:object-cover m-auto  "
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-lg font-semibold">
                        {recommendedVideo.submission.title}
                      </p>
                      <p className="text-gray-600">
                        Creator:{" "}
                        {recommendedVideo.creator.name
                          ? recommendedVideo.creator.name
                          : recommendedVideo.creator.handle}
                      </p>
                    </div>
                  </div>
              </Link>
            ))}
            </div>
         
        </div>
      )}
    </div>
  );
}

export default Videoplayer;
