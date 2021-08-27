import { createElement, createMovieCard, getLocalStorageWatchlist } from './main.js';

const filmList = document.querySelector('#film-list');

const getName = localStorage.getItem('perfil').split('images/')[1];

function addMovieToWatchlist(event) {
  const id = event.target.parentNode.parentNode.querySelector('.btn-watchlist').id;
  const movieElement = document.getElementById(id);
  const title = movieElement.querySelector('.title-hidden').innerText;
  const vote_average = movieElement.querySelector('.nota--value').innerText;
  const overview = movieElement.querySelector('.description--text').innerText;
  const thumbnail = movieElement.querySelector('.imgTest').src; 
  let localStorageList = getLocalStorageWatchlist();
  console.log(thumbnail);
  if (!localStorageList.some((movieObj) => movieObj.id === id)) { // se não estiver no locastorage
    localStorageList.push({ title, vote_average, overview, id, thumbnail, isWatchlistItem: true});
    localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
    event.target.parentNode.parentNode.querySelector('.btn-watchlist').innerHTML = 'Remover'
  } else {
    localStorageList = localStorageList.filter((movieObj) => parseInt(movieObj.id) != id);
    localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
    event.target.innerHTML = '<i class="plus square outline icon"></i>&nbsp;List';
  }
}

function addBtnsWatchlistEventListener() {
  document.querySelectorAll('.btn-watchlist')
    .forEach((btn) => btn.addEventListener('click', addMovieToWatchlist));
};

function addRemoveFromWatchlistEventListeners() {
  const btns = document.querySelectorAll('.btn-watchlist');
  for (let btn of btns) {
    console.log(`cheguei`);
    btn.innerHTML = 'Remover';
    btn.addEventListener('click', (el) => {
      const id = el.target.parentNode.parentNode.querySelector('.btn-watchlist').id
      const movies = document.querySelectorAll('.filme');
      const clickedElement = [...movies].find((movie) => movie.id === id);
      console.log(clickedElement)
      let localStorageList = getLocalStorageWatchlist();
      localStorageList = localStorageList.filter((movieObject) => parseInt(movieObject.id) !== parseInt(id));
      localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
      clickedElement.remove();
    });
  }
}

function listWatchlist() {
  filmList.innerHTML = '';
  document.querySelector('#page-list').style = 'display: none'
  const watchlistArray = getLocalStorageWatchlist();
  console.log(watchlistArray)
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
