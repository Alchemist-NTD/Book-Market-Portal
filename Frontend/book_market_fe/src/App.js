import React from 'react';
import './App.css';
// import { Demo , LoginForm} from './login/tailwind_login';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import { SearchBar } from './search_bar';
// import { Login } from './login.jsx';
// import { Header } from './header/header';
import { HomePage } from './pages/HomePage/HomePage.jsx';
import { Login } from './pages/Login/Login.jsx';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import BookDetails from './components/BookDetails/BookDetails';
import { QueryClient, QueryClientProvider } from 'react-query';
import Profile from './pages/Profile/Profile';
import Cart from './pages/Cart/Cart';
import RatedBooks from './pages/RateBooks/RateBooks';
// import FilmList from './components/FilmList/FilmList';
// import { MyComponentSearchBar } from './page/home_page';
// import WatchingFilm from './components/WatchingFilm/WatchingFilm';
// import FilmPage from './page/FilmPage';
// import NotFound from './page/NotFound';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <div className="font-bold">
        {/* <HomePage></HomePage> */}
        <Router>
          <Header/>
          <Routes>
          {/* <Route path='/' element={<HomePage />} /> */}
            <Route path='/' element={<HomePage key='home'/>} />
            <Route path='/home' element={<HomePage key='home'/>} />
            <Route path='/home/:id' element={<BookDetails key='home'/>} />
              {/* <Route path=':filmId' element={<WatchingFilm />} />
            </Route> */}
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/ratings" element={<RatedBooks/>} />
            <Route path="/carts" element={<Cart/>} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
          
        </Router>
        
      </div>
    </div>
    <Footer/>
    </QueryClientProvider>
  );
}

export default App;