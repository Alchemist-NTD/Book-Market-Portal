import React, { useState, useEffect } from "react";
import image_icon from './login_icon.png'
import './Login.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isInvalidInputVisible, setInvalidInputVisible] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isMatchedPassword, setIsMatchedPassword] = useState(true);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isRegister = searchParams.get('register') === 'true';
    setIsLoginForm(!isRegister);
  }, []);

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

  function handleRegisterSwitch(event) {
    event.preventDefault();
    setIsLoginForm(false);
    setIsErrorVisible(false);
    setInvalidInputVisible(false);
  }

  function handleLoginSwitch(event) {
    event.preventDefault();
    setIsLoginForm(true);
    setIsErrorVisible(false);
    setInvalidInputVisible(false);
  }

  const clickSignIn = async (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!username || !password) {
      setInvalidInputVisible(true);
      return;
    }

    let payload = {
      username: username,
      password: password,
    };

    try {
      let response = await axios.post("http://localhost:8000/login", payload);

      if (response.status === 200) {
        setIsErrorVisible(false);
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("username", username);
        const access = localStorage.getItem("access");

        let usr_info_response = await axios.get(
          `http://localhost:8000/user/retrieve/${username}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (usr_info_response) {
          localStorage.setItem("user_id", usr_info_response.data.usr_id);
        }

        navigate("/home");
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data['detail']) {
        setIsErrorVisible(true)
      }
    }
  };

  const clickSignUp = async (event) => {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let c_password = document.getElementById("confirm_password").value;
    let age = document.getElementById("age").value;
    let location = document.getElementById("location").value;

    if (!username || !password || !c_password) {
      setInvalidInputVisible(true);
      return;
    }

    if (password !== c_password) {
      setIsMatchedPassword(false);
      return;
    }

    let payload = {
      username: username,
      password: password,
      age: age ? age : null,
      location: location ? location : null
    };
    console.log(payload)

    try {
      let response = await axios.post("http://localhost:8000/register", payload);

      if (response.status === 201) {
        setMessage('Register successful! Redirecting to login...');
        setTimeout(() => {
          document.getElementById("result").style.color = 'green';
        }, 1);
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      setMessage('Register failed. because your username is already exists!');
      setTimeout(() => {
        document.getElementById("result").style.color = 'red';
      }, 1);
    }
  };

  return (
    <section>
      <div className="common-login">
        {
          isLoginForm ? 
          (
            <div className="block">
              <button
                onClick={() => {
                    navigate("/");
                    window.location.reload();
                  }
                }
              className="home-nav-login"
              >
                <img
                  className="w-8 h-8 mr-2"
                  src={image_icon}
                  alt="logo"
                ></img>
                Prime Book Shop
              </button>
            </div>
          ) : (
            <div className="block mt-24">
              <button
                onClick={() => {
                    navigate("/");
                    window.location.reload();
                  }
                }
                className="home-nav-register mt-24"
              >
                <img
                  className="w-8 h-8 mr-2"
                  src={image_icon}
                  alt="logo"
                ></img>
                Prime Book Shop
              </button>
          </div>
          )
        }
        {isLoginForm ? 
        (<div className="login-rec">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="header-sign-to-account">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  className="label-username"
                >
                  Your Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="input-username"
                  placeholder="username here"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="input-password"
                  onChange={handleInputChange}
                ></input>
              </div>
              {
                isErrorVisible && 
                <div className="error-message">
                  Username or Password is incorrect, please try again!
                </div>
              }
              {
                isInvalidInputVisible && 
                <div className="error-message">
                  Both Password and Username is required!
                </div>
              }
              <button
                type="submit"
                className="login-btn"
                onClick={clickSignIn}
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500">
                Don’t have an account yet?{" "}
                
                <button
                    className="font-medium text-primary-600 hover:underline"
                    onClick={handleRegisterSwitch}
                >
                    Sign up
                </button>
              </p>
            </form>
          </div>
        </div>) : (
          <div className="register-rec">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="header-sign-to-account">
              Sign up your new account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  className="label-username"
                >
                  Your Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="input-username"
                  placeholder="username here"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="input-password"
                  onChange={(e) => {handleInputChange(e); handlePasswordChange(e);}}
                ></input>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="confirm_password"
                  placeholder="••••••••"
                  className="input-password"
                  onChange={(e) => {handleInputChange(e); handlePasswordChange(e);}}
                ></input>
              </div>
              <div>
                <label
                  className="label-username"
                >
                  Your Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="input-username"
                  placeholder="location here"
                ></input>
              </div>
              <div>
                <label
                  className="label-username"
                >
                  Your Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  className="input-username"
                  placeholder="your age here"
                ></input>
              </div>
              {
                !isMatchedPassword && 
                <div className="error-message">
                  Password and Confirm Password not matched, please try again!
                </div>
              }
              {message && <div id="result" className="result-message">{message}</div>}
              {
                isInvalidInputVisible && 
                <div className="error-message">
                  Both Password, Conform Password and Username is required! please try again!
                </div>
              }
                <button
                    type="submit"
                    className="login-btn"
                    onClick={clickSignUp}
                >
                    Sign up
                </button>

              <p className="text-sm font-light text-gray-500">
                You already have an account?{" "}
                <button
                    className="font-medium text-primary-600 hover:underline"
                    onClick={handleLoginSwitch}
                >
                    Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

export { Login };