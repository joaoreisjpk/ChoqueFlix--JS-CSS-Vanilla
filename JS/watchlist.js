import { createElement } from './main.js';
const watchlistArray = JSON.parse(localStorage.getItem('watchlist'));
const watchlistSection = document.querySelector('#watchlist')
const localStorageList = [];

function addMovieToWatchlist(event) {
  const id = event.target.id;
  const movieElement = document.getElementById(id);
  console.log(movieElement);
  localStorageList.push(movieElement.innerHTML);
  localStorage.setItem('watchlist', JSON.stringify(localStorageList))
}

function addBtnsWatchlistEventListener() {
  const btnsWatchlist = document.getElementsByClassName('btn-watchlist');
  [...btnsWatchlist].forEach((btn) => {
    btn.addEventListener('click', addMovieToWatchlist)
  })
}

function fetchWatchlist() {
  watchlistArray.forEach((movie) => {
    console.log(movie);
    const movieCard = createElement('div', 'filme', movie)
    watchlistSection.appendChild(movieCard);
  })
}

window.onload = fetchWatchlist;

export { addBtnsWatchlistEventListener }