import React, { useState } from "react";
import './Search.css'

const Search = (props) => {
  const searchFunction = props.searchFunction

  const [contentSearch, setContentSearch] = useState("");

  const [selectedOption, setSelectedOption] = useState('title');

  const [dataType, setDataType] = useState('text');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    const opt = event.target.value
    if (opt === 'year_publication') {
      setDataType('number');
    } else {
      setDataType('text');
    }
  };

  const changeSearchBar = (event) => {
    event.preventDefault();
    setContentSearch(event.target.value);

  };

  const activateSearch = (event) => {
    event.preventDefault();
    searchFunction(contentSearch, selectedOption);
  };

  return (
    <form onSubmit={activateSearch}>
      <div className="p-1 text-xl font-normal inline border-2 mr-2 rounded-lg">
        <select 
          value={selectedOption} onChange={handleOptionChange}
          className="bg-white text-gray-800 font-bold rounded-lg rounded-r-none border"
        >
          <option value="title">Title</option>
          <option value="genres">Genres</option>
          <option value="author">Author</option>
          <option value="publisher">Publisher</option>
          <option value="year_publication">Year</option>
        </select>
        <input
          className="search-input"
          type={dataType}
          name="SearchTerm"
          placeholder={`Type the ${selectedOption.split('_').join(' ')} of book...`}
          value={contentSearch}
          onChange={changeSearchBar}
        />
      </div>
      <input type="submit" 
        value="Search" 
        className="button-submit" 
      />
    </form>
  );
};

export default Search;