import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

interface Actor {
  id: string;
  postId: string;
  creator: {
    pic: string;
    name: string;
  };
}

function Actor() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchData(pageNumber: number): Promise<any> {
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

  async function fetchAllPages(): Promise<Actor[]> {
    let allData: Actor[] = [];
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
    fetchAllPages()
      .then((allData) => {
        setActors(allData);
        setIsLoading(false);
        console.log("All data retrieved:", allData);
      })
      .catch((error) => {
        console.error("Error while fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 mt-5" >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {actors.map((item) => (
            <Link to={`/videoplayers?video_id=${item.postId}`} key={item.id}>
              <div className="text-center">
                <div className="relative group">
                  <img
                    className="h-40 w-40 md:h-48 md:w-48 rounded-full mx-auto transition-transform duration-300 transform scale-100 group-hover:scale-110"
                    src={item.creator.pic}
                    alt={item.creator.name}
                  />
                </div>
                <p className="mt-2">{item.creator.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Actor;
