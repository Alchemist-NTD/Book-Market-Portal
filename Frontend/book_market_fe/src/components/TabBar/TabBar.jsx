import React, { useEffect, useState } from 'react';
import './TabBar.css'
import { useNavigate } from 'react-router-dom';

function TabBar() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate()

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <div className={`tab-bar ${expanded ? 'translate-x-0 z-50' : '-translate-x-full'}`}>
        {expanded && <div className="tab-items">
            <div className="inline-block top-0 left-0 h-screen w-40 bg-black" onMouseLeave={handleMouseLeave}>
                <button className='bar' onClick={()=>{navigate('/')}}>
                    <span role="img" aria-label="Home" className='mr-2 my-auto inline-flex'>
                        🏠
                    </span>
                    <span className='inline-flex'>Home</span>
                </button>
                <button className='bar' onClick={()=>{navigate('/profile')}}>
                    <span role="img" aria-label="Profile" className='mr-2 my-auto inline-flex'>
                    👤
                    </span>
                    <span className='inline-flex'>My Profile</span>
                </button>
                <button className='bar' onClick={()=>{navigate('/carts')}}>
                    <span role="img" aria-label="Cart" className='mr-2 my-auto inline-flex'>
                    🛒
                    </span>
                    <span className='inline-flex'>My Cart</span>
                </button>
                <button className='bar' onClick={()=>{navigate('/ratings')}}>
                    <span role="img" aria-label="Star" className='mr-2 my-auto inline-flex'>
                    ⭐️
                    </span>
                    <span className='inline-flex'>My Ratings</span>
                </button>

            </div>
            <div className='fixed top-0 ml-40'>
                <button
                    className="rounded-r hover:border border-l-0 top-0 left-0 w-10 h-10 bg-red-500 text-white items-center justify-center"
                    onClick={toggleExpand}
                >
                        ⨉
                </button>
            </div>
        </div>
        }
        {!expanded && <button className={`fixed hover:border rounded-r top-0 left-13 w-10 h-10 bg-blue-500 text-white ${expanded ? 'hidden' : ''}`}
            onClick={toggleExpand}>
                ☰
        </button>}
        
    </div>
  );
}

export default TabBar;