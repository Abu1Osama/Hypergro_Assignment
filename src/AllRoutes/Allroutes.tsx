import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import Videoplayer from "../Components/Videoplayer";
import Actor from "../Components/Actor";
import Reel from "../Components/Reel";

function Allroutes() {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/videoplayers"} element={<Videoplayer  />} />
       
        <Route path="/actors" element={<Actor />} />
        <Route path="/reels" element={<Reel/>} />
      </Routes>
    </>
  );
}

export default Allroutes;
