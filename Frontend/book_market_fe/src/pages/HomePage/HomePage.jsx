import React, { useState } from "react";

import './HomePage.css'

import Search from '../../components/Search/Search.jsx';
// import MovieSearch from "./search_bar/movie_search.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
// import { SearchBar } from "../components/SearchBar/Searchbar.jsx";
import BookList from "../../components/BookList/BookList";
// import { useContext } from 'react';
import { Outlet } from "react-router-dom";
import RCM_BookList from "../../components/RCM_BookList/RCM_BookList";
// import RCM_FilmList from "../components/RCM_FilmList/RCM_FilmList.jsx";
export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Handle search logic here using the search term
    // e.g., make API requests, filter data, etc.
  };
  //let user = useContext(null);
  return (
    // let token = localStorage.getItem("access");

    <div className="text-white">
      {/* <SearchBar onSearch={handleSearch} /> */}
      <NavBar />
        {/* <SearchBar></SearchBar> */}
        {/* <Search></Search> */}
        {/* <SearchBar></SearchBar> */}
      {/* Render the rest of your component */}
      <BookList></BookList>

      <RCM_BookList/>
      {/* <MovieSearch></MovieSearch> */}
      {/* <Outlet /> */}
    </div>
  );
};

//export default MyComponentSearchBar;