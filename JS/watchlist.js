import { createElement, createMovieCard, getLocalStorageWatchlist } from './main.js';

const filmList = document.querySelector('#film-list');

const getName = localStorage.getItem('perfil').split('images/')[1];

function addMovieToWatchlist(event) {
  const id = event.target.parentNode.parentNode.querySelector('.btn-watchlist').id;
  let localStorageList = getLocalStorageWatchlist();
  if (!localStorageList.some(({ id: movieId }) => movieId === id)) { // se não estiver no locastorage
  const movieElement = document.getElementById(id);
  const title = movieElement.querySelector('.title-hidden').innerText;
  const vote_average = movieElement.querySelector('.nota--value').innerText;
  const overview = movieElement.querySelector('.description--text').innerText;
  const thumbnail = movieElement.querySelector('.imgTest').src; 
    localStorageList.push({ title, vote_average, overview, id, thumbnail, isWatchlistItem: true });
    localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
    event.target.parentNode.parentNode.querySelector('.btn-watchlist').innerHTML = 'Remover'
  } else {
    localStorageList = localStorageList.filter(({id: movieId}) => +(movieId) != id);
    localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
    event.target.innerHTML = '<i class="plus square outline icon"></i>&nbsp;List';
  }
}

function addBtnsWatchlistEventListener() {
  document.querySelectorAll('.btn-watchlist')
    .forEach((btn) => btn.addEventListener('click', addMovieToWatchlist));
};

function addRemoveFromWatchlistEventListeners() {
  document.querySelectorAll('.btn-watchlist')
    .forEach((btn) => {
      btn.innerHTML = 'Remover';
      btn.addEventListener('click', (event) => {
        const id = event.target.parentNode.parentNode.querySelector('.btn-watchlist').id
        const movies = document.querySelectorAll('.filme');
        const clickedElement = [...movies].find((movie) => movie.id === id);
        let localStorageList = getLocalStorageWatchlist();
        localStorageList = localStorageList.filter((movieObject) => +(movieObject.id) !== +(id));
        localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
        if (clickedElement) clickedElement.remove();
      });
    });
}

function listWatchlist() {
  filmList.innerHTML = '';
  document.querySelector('#page-list').style = 'display: none';
  const watchlistArray = getLocalStorageWatchlist();
  if (watchlistArray.length === 0) {
    const isEmpty = createElement('p', 'watchlist-empty', 'Sua lista está vazia');
    document.querySelector('#film-list').appendChild(isEmpty)
  }
  watchlistArray.forEach(async (movieObj) => {
    const isEmpty = document.querySelector('.watchlist-empty')
    if (isEmpty) isEmpty.remove();
    await createMovieCard(movieObj);
  })
}

export { addBtnsWatchlistEventListener, listWatchlist, getName, addRemoveFromWatchlistEventListeners }
