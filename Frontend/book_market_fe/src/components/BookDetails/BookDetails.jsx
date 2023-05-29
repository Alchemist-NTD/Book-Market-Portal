import React, { useEffect, useState } from "react";
import './BookDetails.css'
import {
  useParams,
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import he from 'he'
import NavBar from "../NavBar/NavBar";
import axios from "axios";
// import RCM_BookList from "../components/RCM_BookList/RCM_BookList";
import BookItem from "../BookItem/BookItem";

const access_token = localStorage.getItem("access");
const user_id = localStorage.getItem("user_id");

const ShoppingCartIcon = () => (
  <svg className="mr-2 inline-block" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="30" height="30"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M4 4h16l2 7H2L4 4z" />
  </svg>
);

const BookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [rate, setRate] = useState(0);
  const [ratePermit, setRatePermit] = useState(false);
  const [shouldDisplayImage, setShouldDisplayImage] = useState(false)
  const [rcmBook, setRcmBook] = useState([]);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  let url = `http://localhost:8000/book/info/${id}`;
  const backupImgUrl = 'https://thumbs.gfycat.com/ConventionalOblongFairybluebird-max-1mb.gif'
  const access_token = localStorage.getItem('access')
  const headers = {};
  if (access_token !== '') {
    headers.Authorization = `Bearer ${access_token}`;
  }
  
  useEffect(()=> {
    const img = new Image();
    img.src = '';
    if (book) {
      img.src = book.img_l;
    }

    img.onload = () => {
      setImageLoaded(true);
      setImageWidth(img.width);
      setImageHeight(img.height);
    };

    setShouldDisplayImage(
      imageLoaded &&
      imageWidth !== null &&
      imageHeight !== null &&
      imageWidth >= 10 &&
      imageHeight >= 10
    )
  }, [book, imageLoaded]);

  useEffect(() => {
    const lote = location.pathname.split("/")[2];
    const getData = async () => {
      try {
        const book_res = await axios.get(url, {
          headers: headers,
        });
        setBook(book_res.data);
      } catch (error) {
        console.log("error to get book.......");
        console.log(error.message);
      }

      try {
        const res = await axios.get(
          `http://localhost:8000/book/rate/retrieve/${user_id}/${lote}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log(res.data);
        if (res.data != null && res.data !== {} && res.data.star > 0) {
          setRate(res.data.star);
          setRatePermit(false);
        } else {
          setRate(0);
          setRatePermit(true);
        }
      } catch (error) {
        console.log("error to get rate:....");
        console.log(error.message);
        setRate(0);
        setRatePermit(true);
      }

      try {
        const rcm_res = await axios.get(
          `http://localhost:8000/book/recommender/content/${lote}`);
        console.log(rcm_res.data);
        setRcmBook(rcm_res.data);
      } catch (error) {
        console.log("error to get RCM book.......");
        console.log(error.message);
      }
    };
    getData();
  }, [id]);

  const handlePermitChange = () => {
    if (ratePermit && rate > 0) {
      ConBookRate(rate);
    }
    setRatePermit(!ratePermit);
  };

  const onChangeRate = (score) => {
    if (ratePermit) {
      setRate(score);
      console.log(score);
    }
  };
  const ConBookRate = async (score) => {
    const user_id = localStorage.getItem("user_id");
    setRate(score);
    // setNumRate(numRate + 1);
    // console.log(book.id);
    // console.log(user_id);

    let payload = {
      book: book.id,
      user: user_id,
      star: rate,
    };
    try {

      const res = await axios.post(
        "http://localhost:8000/book/rate/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBookClick = (id) => {
    navigate(`/home/${id}`);
    // window.location.reload();
  };


  const handleAddToCart = async () => {

    let payload = {
      user_id : user_id,
      book: id
    }

    try {
      await axios.post(`http://localhost:8000/cart/items/add`, payload, {
        headers: headers,
    });
      setIsAddToCart(true)
    } catch (error) {
      console.log(error);
    }
};

  const rating_stars = [];
  for (let i = 1; i <= 10; i++) {
    rating_stars.push(
      <button key={i}>
        <svg
          aria-hidden="true"
          className={
            i <= rate ? "w-6 h-6 text-yellow-400" : "w-6 h-6 text-gray-400"
          }
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          onMouseOver={() => onChangeRate(i)}
          // onClick={() => ConFirmRate(i)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      </button>
    );
  }

  return (
    <div className="text-white">
      <NavBar />
      <p className="ml-16 flex text-3xl justify-start font-normal mb-0 mt-2">
        BOOK INFOMATION
      </p>
      {book === null ? (
        <div className="text-3xl text-center flex justify-center items-center">
          Sorry! This book details crashed.
        </div>
      ) : (
        <div>
          <div className="p-2 grid grid-cols-10 gap-2 mb-6 mx-16 border rounded-lg">
            <div className="inline-block grid-rows-6 col-span-3 text-center mx-auto">
              <div className="row-span-4">
                {shouldDisplayImage ? (
                    <img src={book.img_l} alt="Your Image" className="img-info"/>
                  ) : (
                    <img src={backupImgUrl} alt="Fallback Image" className="img-info border-none"/>
                  )
                }
                {/* <img src={book.img_l}
                  alt="Your Image"
                  className="mx-auto mt-10 w-auto h-3/5 border border-white">
                </img> */}
                <p className="text-3xl row-span-1">{`Price: ${book.price} $`}</p>
              </div>
              <div className="row-span-1">
                <div className="my-4">
                  {rating_stars}
                  {rate > 0 ? (
                    <p className="mx-4 my-1 font-semibold">{rate}/10</p>
                  ) : (
                    <p />
                  )}
                </div>
                <button
                  onClick={handlePermitChange}
                  className="rate-btn"
                >
                {ratePermit === true ? "Submit" : "Re-rate"}
                </button>
              </div>
              <div className="row-span-1">
                <ShoppingCartIcon />
                <button
                  onClick={handleAddToCart}
                  className="purchase-btn"
                >
                  Add to Cart
                </button>
                {isAddToCart && (<div className="text-border-white text-green-400 text-sm">This item was added to your current cart!</div>)}
              </div>
            </div>
            <div className="info-container">
              <div className="inline-block mb-2">
                <p className="text-3xl underline">TITLE</p>
                <p className="text-xl">{`  ${he.decode(book.title)}  `}</p>
              </div>
              <div className="inline-block">

                <p className="text-2xl underline">GENRES</p>
                <p>
                  {` ${he.decode(book.genres).toUpperCase().split(',').join(', ')}${book.genres === 'No genres Found' ? '.' : ' ...'}`}
                </p>
                <br></br>

                <p className="text-xl underline">AUTHOR</p>
                <p>{` ${he.decode(book.author)}.`}</p>
                <br></br>

                <p className="text-xl underline">PUBLISHER</p>
                <p>{` ${he.decode(book.publisher)}.`}</p>
                <br></br>

                <p className="text-xl underline">YEAR OF PUBLICATION</p>
                <p>{book.year_publication}</p>
                <br></br>

                <p className="text-xl underline">NUMBER OF PAGES</p>
                <p>{book.total_pages === 0 ? 'undefined.' : book.total_pages}</p>
                <br></br>

                <p className="text-xl underline">DESCRIPTION</p>
                <p>{he.decode(book.description)}</p>
              </div>
              
            </div>
            
          </div>
          {/* <div>
            {rate != 0 ? (
              <p>You rated this book {rate} out of 10 stars!</p>
            ) : (
              <div />
            )}
          </div> */}
          <p className="ml-16 font-bold flex text-3xl justify-start mb-2 mt-6">
            SIMILAR BOOKS RECOMMEND FOR YOU
          </p>
          <div className="border-2 rounded-lg p-2.5 grid grid-cols-8 md:grid-cols-8 gap-6 mb-12 mx-16">
            {rcmBook.map((book) => (
              <div key={book.id}>
                <div className='hover:cursor-pointer' onClick={() => handleBookClick(book.id)}>
                  <BookItem bookProps={book} key={book.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;