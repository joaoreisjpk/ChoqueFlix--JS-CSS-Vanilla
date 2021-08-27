import { createElement } from './main.js';

const filmList = document.querySelector('#film-list');

const getName = localStorage.getItem('perfil').split('images/')[1];

let localStorageList = (localStorage.getItem(`watchlist-${getName}`)) ?
  JSON.parse(localStorage.getItem(`watchlist-${getName}`)) : [];

function addMovieToWatchlist(event) {
  const movieId = event.target.id;
  const movieElement = document.getElementById(movieId);
  if (!localStorageList.includes(movieElement.innerHTML)) {
    localStorageList.push(movieElement.innerHTML);
    localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
  };
};

function addBtnsWatchlistEventListener() {
  document.querySelectorAll('.btn-watchlist')
    .forEach((btn) => btn.addEventListener('click', addMovieToWatchlist));
};

function listWatchlist() {
  filmList.innerHTML = '';
  const watchlistArray = JSON.parse(localStorage.getItem(`watchlist-${getName}`));
  if (watchlistArray) watchlistArray.forEach((movie) => {
    const movieCard = createElement('div', 'filme', movie);
    movieCard.style.margin = '20px auto';
    filmList.appendChild(movieCard);
  })
  document.querySelectorAll('#film-list .btn-watchlist')
    .forEach((btn) => {
      const contentBtn = btn.parentElement.parentElement.innerHTML;
      btn.innerHTML = 'Remover';
      btn.addEventListener('click', () => {
        const parent = btn.parentElement.parentElement.parentElement;
        localStorageList.pop(contentBtn);
        localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
        parent.remove();
      });
    });
}

export { addBtnsWatchlistEventListener, listWatchlist, localStorageList, getName }
