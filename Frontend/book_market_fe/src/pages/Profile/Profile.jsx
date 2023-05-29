import './Profile.css'

import React, { useEffect, useState } from "react";
import {
  useParams,
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import he from 'he'
import NavBar from "../../components/NavBar/NavBar.jsx";
import axios from "axios";


const access_token = localStorage.getItem("access");
const username = localStorage.getItem("username");

const Profile = () => {
    const [isEditForm, setIsEditForm] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [isMatchedPassword, setIsMatchedPassword] = useState(true);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [isInvalidInputVisible, setInvalidInputVisible] = useState(false);

    const navigate = useNavigate();
    let url = `http://localhost:8000/user/retrieve/${username}`;
    
    const headers = {};
    if (access_token !== '') {
        headers.Authorization = `Bearer ${access_token}`;
    }

    const getUserInfo = async () => {
        try {
        const usr_info_response = await axios.get(
            url,
            {
                headers: headers,
            }
        );
        setUser(usr_info_response);
        setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        getUserInfo();
    }, []);

    const editProfile = async (event) => {
        event.preventDefault();

        let age = document.getElementById("age-edit").value;
        let location = document.getElementById("loc-edit").value;

        let payload = {
            age: age,
            location: location,
        };

        try {
        let response = await axios.patch(`http://localhost:8000/user/update/${username}`,
            payload,
            {
                headers: headers,
            }
        );
        

        if (response.status === 200) {
            getUserInfo();
            setViewInfo();
        }
        } catch (error) {
            if (error.response && error.response.data && error.response.data['detail']) {
                console.log(error.response.data['detail'])
            }
        }
    };

    const editPassword = async (event) => {
        event.preventDefault();
        let password = document.getElementById("password").value;
        let new_password = document.getElementById("edit-password").value;
        let confirm_new_password = document.getElementById("confirm-edit-password").value;
        if (new_password !== confirm_new_password) {
            setIsMatchedPassword(false);
            return;
        }

        if (!password || !new_password) {
            setInvalidInputVisible(true);
            return;
        }

        let payload = {
            password: password,
            new_password: new_password,
        };

        try {
        let response = await axios.post(`http://localhost:8000/user/update/password/${username}`,
            payload,
            {
                headers: headers,
            }
        );
        

        if (response.status === 200) {
            setMessage('Password changed successfully! For security purposes, redirecting to login...');
            setTimeout(() => {
            document.getElementById("result").style.color = 'green';
            }, 1);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }} catch (error) {
            if (error.response && error.response.data) {
                setMessage(`Change Password failed. because ${error.response.data}!`);
                setTimeout(() => {
                    document.getElementById("result").style.color = 'red';
                }, 1);
            }
        }

    };

    useEffect(()=> {
        getUserInfo();
    }, []);

    function handleFormSwitch(event) {
        event.preventDefault();
        setIsEditForm(true);
        setIsChangePassword(false);
    }

    function handlePasswordSwitch(event) {
        event.preventDefault();
        setIsEditForm(false);
        setIsChangePassword(true);
    }

    function setViewInfo() {
        setIsChangePassword(false);
        setIsEditForm(false);
    }

    function handleInfoView(event) {
        event.preventDefault();
        setViewInfo();
    }

    function handleInputChange(event) {
        event.preventDefault();
        setIsErrorVisible(false);
        setInvalidInputVisible(false);
        setMessage('')
    }

    function handlePasswordChange(event) {
        event.preventDefault();
        setIsMatchedPassword(true);
    }


    return (

        <div className="text-white h-screen">
            <NavBar />
            <p className="ml-16 flex text-3xl justify-start font-normal mb-0 mt-2">
                USER INFOMATION
            </p>
            {!isEditForm && !isChangePassword && (
            <div>
                <div className="p-2 gap-2 mb-6 mx-16 border">
                    <div className="inline-block text-center mx-auto">
                        <p className='text-2xl'>User Infomation</p>
                        <div className="info-container rounded-lg">
                            <div className="inline-block">
                                <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                    Username
                                    <p className='inline-flex text-xl '>
                                        {!isLoading && `: ${user.data.username}`}
                                    </p>
                                </p>
                                <br/>

                                <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                    Age
                                    <p className='inline-flex text-xl '>
                                        {!isLoading && `: ${user.data.age}`}
                                    </p>
                                </p>
                                <br/>

                                <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                    Location
                                    <p className='inline-flex text-xl '>
                                        {!isLoading && `: ${user.data.location}`}
                                    </p>
                                </p>
                            </div>
                        </div>
                        <div>
                            <button className='nav-login-logout p-1 bg-gray-500'
                                onClick={handleFormSwitch}
                            >
                                Edit Info
                            </button>
                            <button className='nav-login-logout p-1 bg-gray-500'
                                onClick={handlePasswordSwitch}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>)} 
            {isEditForm && (
                <div>
                <div className="p-2 gap-2 mb-6 mx-16 border">
                    <div className="inline-block text-center mx-auto">
                        <p className='text-2xl'>Edit Infomation</p>
                        <div className="info-container rounded-lg">
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div className="inline-block my-1">
                                    <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                        Username
                                        <p className='inline-flex text-xl'>
                                            {!isLoading && `: ${user.data.username}`}
                                        </p>
                                    </p>
                                    <br/>

                                    <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                        Age:
                                        <input
                                            type="number"
                                            name="age-edit"
                                            id="age-edit"
                                            className="text-black inline-flex mx-2 w-20 text-xl rounded-lg"
                                            defaultValue={!isLoading && `${user.data.age}`}
                                            onChange={handleInputChange}
                                        ></input>
                                        
                                    </p>
                                    <br/>

                                    <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                        Location:
                                        <input
                                            type="text"
                                            name="loc-edit"
                                            id="loc-edit"
                                            className="text-black inline-flex mx-2 w-30 text-xl rounded-lg"
                                            defaultValue={!isLoading && `${user.data.location}`}
                                            onChange={handleInputChange}
                                        ></input>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div>
                            <button className='nav-login-logout p-1 bg-green-700 hover:bg-green-400'
                                onClick={editProfile}
                            >
                                Submit
                            </button>
                            <button className='nav-login-logout p-1 bg-gray-500'
                                onClick={handleInfoView}
                            >
                                View Info
                            </button>
                            <button className='nav-login-logout p-1 bg-gray-500'
                                onClick={handlePasswordSwitch}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>)
            }
            {isChangePassword && (<div>
                <div className="p-2 gap-2 mb-6 mx-16 border">
                    <div className="inline-block text-center mx-auto">
                        <p className='text-2xl'>Change Password</p>
                        <div className="info-container rounded-lg">
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div className="inline-block my-1">
                                    <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                        Username
                                        <p className='inline-flex text-xl '>
                                            {!isLoading && `: ${user.data.username}`}
                                        </p>
                                    </p>
                                    <br/>

                                    <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                        Password
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="••••••••"
                                            className="text-black inline-flex mx-2 w-30 text-xl rounded-lg"
                                            onChange={(e) => {handleInputChange(e); handlePasswordChange(e);}}
                                        ></input>
                                    </p>

                                    <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                        New Password
                                        <input
                                            type="password"
                                            name="password"
                                            id="edit-password"
                                            placeholder="••••••••"
                                            className="text-black inline-flex mx-2 w-30 text-xl rounded-lg"
                                            onChange={(e) => {handleInputChange(e); handlePasswordChange(e);}}
                                        ></input>
                                    </p>

                                    <p className="text-xl inline-flex my-1 text-center justify-center items-center">
                                        Confirm New Password
                                        <input
                                            type="password"
                                            name="password"
                                            id="confirm-edit-password"
                                            placeholder="••••••••"
                                            className="text-black inline-flex mx-2 w-30 text-xl rounded-lg"
                                            onChange={(e) => {handleInputChange(e); handlePasswordChange(e);}}
                                        ></input>
                                    </p>
                                    {
                                        isInvalidInputVisible && 
                                        <div className="error-message">
                                            Password and New Password are required! please try again!
                                        </div>
                                    }
                                    {
                                        !isMatchedPassword && 
                                        <div className="error-message">
                                            Password and Confirm Password not matched, please try again!
                                        </div>
                                    }
                                    {message && <div id="result" className="result-message">{message}</div>}
                                </div>
                            </form>
                        </div>
                        <div>
                            <button className='nav-login-logout p-1 bg-green-700 hover:bg-green-400'
                                onClick={editPassword}
                            >
                                Submit
                            </button>
                            <button className='nav-login-logout p-1 bg-gray-500'
                                onClick={handleInfoView}
                            >
                                View Info
                            </button>
                            <button className='nav-login-logout p-1 bg-gray-500'
                                onClick={handleFormSwitch}
                            >
                                Edit Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>)
            }
        </div>

    );
};

export default Profile;