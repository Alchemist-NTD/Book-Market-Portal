import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css'
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import he from 'he';


const access_token = localStorage.getItem("access");
const user_id = localStorage.getItem("user_id");
const username = localStorage.getItem("username");


const Carts = () => {
    const [cartList, setCartList] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [isCartList, setIsCartList] = useState(true);
    const [idxCart, setIdxCart] = useState(-1);
    const [isChosenCart, setIsChosenCart] = useState(false);
    const navigate = useNavigate();

    const headers = {};
    if (access_token !== '') {
        headers.Authorization = `Bearer ${access_token}`;
    }

    const handleItemsList = (event) => {
        event.preventDefault();
        setIsCartList(false);
    };

    const handleCartList = (event) => {
        event.preventDefault();
        setIsCartList(true);
    };

    const handleItemClick = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:8000/cart/items/list/${itemId}`, {
              headers: headers,
          });
            setItemsList(response.data);
            setIsCartList(false);
            setIsChosenCart(true);
            setIdxCart(itemId);
          } catch (error) {
            console.log(error);
        }
    };


    const handleDeleteCart = async (cartId) => {
        try {
          await axios.delete(`http://localhost:8000/cart/delete/${cartId}`, {
            headers: headers,
        });
          setCartList(cartList.filter((cart) => cart.id !== cartId));
          if (cartId === idxCart ) {
            setItemsList([]);
            setIdxCart(-1);
          }
        } catch (error) {
          console.log(error);
        }
    };

    const handleDeleteCartItem = async (itemId) => {
        try {
          await axios.delete(`http://localhost:8000/cart/items/delete/${itemId}`, {
            headers: headers,
        });
          setItemsList(itemsList.filter((cart) => cart.id !== itemId));
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
        const fetchCarts = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/cart/list/${user_id}`, {
                headers: headers,
            });
            setCartList(response.data);
        } catch (error) {
            console.error('Error fetching carts:', error);
        }
        };

        fetchCarts();
    }, [itemsList]);

    return (
    <div className='text-white'>
        <NavBar/>
        <div className='flex justify-start'>
            <button className={isCartList ? 'chosen-sec' : 'unchosen-sec'}
                onClick={handleCartList}
            >
                <h1 className='mx-auto'>
                    YOUR CARTS
                </h1>
            </button>
            <button className={!isCartList ? 'chosen-sec' : 'unchosen-sec'}
                onClick={handleItemsList}
            >
                <h1 className='mx-auto'>
                    CART DETAILS
                </h1>
            </button>
        </div>
        {isCartList &&
            (<table className="min-w-full bg-black border border-gray-200">
            <thead>
            <tr>
                <th className="cell w-1/12">ID</th>
                <th className="cell w-3/12">DETAILS</th>
                <th className="cell border w-4/12">DATE CREATED</th>
                <th className="cell border w-4/12">TOTAL PRICE</th>
                <th className="cell border">STATUS</th>
                <th className="cell border">DEL</th>
            </tr>
            </thead>
            <tbody>
            {cartList.map((cart) => (
                <tr key={cart.id}>
                    <td className='cell'>{cart.id}</td>
                    <td className='cell'>
                        <button className='hover:underline'
                            onClick={()=>{handleItemClick(cart.id)}}
                        >
                            Details
                        </button>
                    </td>
                    <td className='cell'>{cart.created_at.split(/[ZT]/).join(' ')}</td>
                    <td className='cell'>{cart.total_amount}</td>
                    <td className='cell'>{
                        cart.status === 'yes' ? 
                        (<span className='border px-2 py-0.5 bg-green-800 rounded-lg'>&#x2713;</span>) 
                        : (<span className='border px-1.5 py-0.5 bg-yellow-500 rounded-lg'>&#x2026;</span>)
                    }</td>
                    <td className='cell'>
                        <button className='del-cart-btn'
                            onClick={()=>{handleDeleteCart(cart.id);}}
                        >
                            🗑️
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>)
        }
        {!isCartList &&
            (<div>
            <table className="min-w-full bg-black border border-gray-200">
            <thead>
            <tr>
                <th className="cell w-1/12">ID</th>
                <th className="cell w-3/12">TITLE</th>
                <th className="cell border w-4/12">AUTHOR</th>
                <th className="cell border w-4/12">DATE ADDED</th>
                <th className="cell border">QUANTITY</th>
                <th className="cell border">PRICE</th>
                <th className="cell border">TOTAL</th>
                <th className="cell border">DEL</th>
            </tr>
            </thead>
            <tbody>
            {isChosenCart && (itemsList.map((item) => (
                <tr key={item.id}>
                    <td className='cell'>{item.id}</td>
                    <td className='cell'>
                        <button className='hover:underline'
                            onClick={()=>{navigate(`/home/${item.book}`)}}
                        >
                            {he.decode(item.book_title)}
                        </button>
                    </td>
                    <td className='cell'>
                        {he.decode(item.book_author)}
                    </td>
                    <td className='cell'>{item.created_at.split(/[ZT]/).join(' ')}</td>
                    <td className='cell'>{item.quantity}</td>
                    <td className='cell'>{item.book_price}</td>
                    <td className='cell'>{item.total_amount}</td>
                    <td className='cell'>
                        <button className='del-cart-btn'
                            onClick={()=>{handleDeleteCartItem(item.id);}}
                        >
                            🗑️
                        </button>
                    </td>
                </tr>
            )))}
            <tr key='summary'>
                    <td className='cell'>Cart{idxCart === -1 ? '' : `: ${idxCart}`}</td>
                    <td className='cell border-none'>
                        
                    </td>
                    <td className='cell border-none'>
                        
                    </td>
                    <td className='cell border-none'></td>
                    <td className='cell border-none'></td>
                    <td className='cell border-none'></td>
                    <td className='cell'>
                        {itemsList.reduce((total, item) => total + item.total_amount, 0)}
                    </td>
                    <td className='cell'>.</td>
                </tr>
            </tbody>
        </table>
        {(idxCart !== -1) && (<button className='hover:bg-green-900 hover:border-2 my-2 p-1 border rounded-lg bg-green-600'>
            CHECKOUT
        </button>)}
        </div>
        )
        }
    </div>
  );
};

export default Carts;