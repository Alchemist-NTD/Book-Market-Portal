import React, { useEffect, useState, useRef } from "react";
import BookItem from "../BookItem/BookItem";
import './BookList.css'
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
// import WatchingBook from "../WatchingBook/WatchingBook";
import Search from "../Search/Search";
import { useQuery, useQueryClient } from 'react-query';


const access_token = localStorage.getItem("access");
const BookList = () => {
  // using cache to avoid loading
  const queryClient = useQueryClient();

  const [Books, setBooks] = useState([]);
  const [bigTitle, setBigTitle] = useState(['ALL BOOKS']);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [totalItems, setTotalItems] = useState(0);
  // const [selectedBook, setSelectedBook] = useState(null);
  // const { BookId }= useParams();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  const url = "http://localhost:8000/book/list";

  const getBooks = async () => {
    const access_token = localStorage.getItem('access')
    const headers = {};
    if (access_token !== '') {
      headers.Authorization = `Bearer ${access_token}`;
    } 

    try {
      const res = await axios.get(url, {
        headers: headers,
      });
      
      return res.data;
      
    } catch (error) {
      console.log(error.message);
    }
  };

  
  const {data: books, isIdle, isLoading, refetch} = useQuery('list-book', getBooks, {
    enabled: false,
  });

  useEffect(() => {
    if (!books) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (isIdle || isLoading || !books) {
      setIsLoadingList(true);
    } else {
      setIsLoadingList(false);
      setFilteredBooks(books);
      setTotalItems(books.length);
    }
  }, [books, isIdle, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10 * 60 * 1000); // Gọi lại fetch sau mỗi 10 phút

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSearchContent = async (searchContent, selectedOption) => {
    console.log()
    if (searchContent.trim() === '') {
      return;
    }

    try {
      
      let params = {};
      params[selectedOption] = searchContent;

      

      setIsLoadingList(true);
      setBigTitle("SEARCH RESULTS")

      const access_token = localStorage.getItem('access')
      const headers = {};
      if (access_token !== '') {
        headers.Authorization = `Bearer ${access_token}`;
      } 

      const res = await axios.get(
        "http://localhost:8000/book/search",
        {
          params: params,
          headers: headers,
        }
      );
      
      setCurrentPage(1)
      setIsLoadingList(false);
      // console.log(res.data.length)
      queryClient.setQueryData('list-book', res.data);

      // console.log(queryClient.getQueriesData('list-book')[0][1].data);

    } catch (error) {
      setIsLoadingList(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = filteredBooks.slice(startIndex, endIndex);

  return (
    <div>
      <div className="py-8 justify-center">
        <Search searchFunction={handleSearchContent} />
      </div>
      <p className="book-container-title mb-0 mt-2">
        {bigTitle}
      </p>
      <div className="object-contain border-2 border-x-0">
        {isLoadingList ? (<p>Executing search ...</p>) : 
        (
          itemsToShow.length < 1 ? (
            <p>Oops, there is no result match your search... Try for another keyword</p>
          ) : (
            <div className="p-2 grid grid-cols-2 md:grid-cols-8 gap-2 mb-6 mx-16">
              {itemsToShow.map((Book) => (
                <div key={Book.id}>
                  <NavLink
                    to={`/home/${Book.id}`}
                  >
                    <BookItem bookProps={Book} key={Book.id} />
                  </NavLink>
                </div>
              ))}
            </div>
          )
        )
        }
        {itemsToShow.length > 0 &&
          (<div className=" flex justify-center">
            <button className="btn-pages-move" onClick={handlePrevPage}>
              &#60; &#60; {" "}
            </button>
              <h4 className="flex justify-center my-1 text-center text-white text-2xl font-bold">
                Page {(isLoadingList) ? 1 : currentPage}
             </h4>
            <button className="btn-pages-move" onClick={handleNextPage}>
              &#62; &#62;
            </button>
          </div>)}
      </div>
    </div>
  );
};

export default BookList;