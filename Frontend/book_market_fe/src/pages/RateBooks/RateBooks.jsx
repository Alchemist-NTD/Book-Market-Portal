import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RateBooks.css'
import he from 'he'
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';


const access_token = localStorage.getItem("access");
const user_id = localStorage.getItem("user_id");
const username = localStorage.getItem("username");


const RatedBooks = () => {
    const [rateList, setRatesList] = useState([]);

    const navigate = useNavigate();

    const headers = {};
    if (access_token !== '') {
        headers.Authorization = `Bearer ${access_token}`;
    }

    const handleDeleteRating = async (rateId, bookId) => {
        try {
          await axios.delete(`http://localhost:8000/book/rate/delete/${user_id}/${bookId}`, {
            headers: headers,
        });
          setRatesList(rateList.filter((rating) => rating.id !== rateId));
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
        const fetchRatedBooks = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/book/rate/list/${username}`, {
                headers: headers,
            });
            setRatesList(response.data);
        } catch (error) {
            console.error('Error fetching rated books:', error);
        }
        };

        fetchRatedBooks();
    }, []);

    return (
    <div className='text-white'>
        <NavBar/>
        <h1 className="text-2xl font-bold mb-4">YOUR RATED BOOKS</h1>
        <table className="min-w-full bg-black border border-gray-200">
        <thead>
          <tr>
            <th className="cell w-2/5">TITLE</th>
            <th className="cell border w-1/4">AUTHOR</th>
            <th className="cell border w-2/5">GENRES</th>
            <th className="cell border">STAR</th>
            <th className="cell border">DEL</th>
          </tr>
        </thead>
        <tbody>
          {rateList.map((rate) => (
            <tr key={rate.id}>
                <td className='cell'>
                    <button className='hover:underline'
                        onClick={()=>{navigate(`/home/${rate.book_id}`)}}
                    >
                        {he.decode(rate.title)}
                    </button>
                </td>
                <td className='cell'>{he.decode(rate.author)}</td>
                <td className='cell'>{he.decode(rate.genres)}</td>
                <td className='cell'>{rate.star}</td>
                <td className='cell'>
                    <button className='del-rate-btn'
                        onClick={()=>{handleDeleteRating(rate.id, rate.book);}}
                    >
                        🗑️
                    </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatedBooks;