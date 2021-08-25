import { createElement } from './main.js';
const filmList = document.querySelector('#film-list')
let localStorageList;
if (localStorage.getItem('watchlist')) {
  localStorageList = JSON.parse(localStorage.getItem('watchlist'));
} else {
  localStorageList = [];
}

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

function listWatchlist() {
  filmList.innerHTML = '';
  const watchlistArray = JSON.parse(localStorage.getItem('watchlist'));
  watchlistArray.forEach((movie) => {
    console.log(movie);
    const movieCard = createElement('div', 'filme', movie)
    filmList.appendChild(movieCard);
  })
}

window.onload = () => {
 // if (localStorage.getItem('watchlist')) localStorageList = JSOn.parse(localStorage.getItem('watchlist'))
}
export { addBtnsWatchlistEventListener, listWatchlist}