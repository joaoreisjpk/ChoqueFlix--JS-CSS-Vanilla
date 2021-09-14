// import {  } from "./watchlist.js";
import { addBtnsWatchlistEventListener, createElement, createImg, createMovieCard, allApiData } from "./main.js";
import { removeBanner } from "./banner.js";

const getSearch = document.querySelectorAll('.searchbar');
const getFilmList = document.getElementById('film-list');

const createHtml = (nota, description) =>
  `<div class='description'>
    <div class='nota'>Classificação: 
      <span class='nota--value'>${nota}</span>
    </div>
    <div class='description'>Descrição: 
      <spam class='description--text'>${description.slice(0, 300) + '...'}<span>
    </div>
  </div>`

const createFilme = async (Title, Poster, imdbRating, Plot, imdbID) => {
  getFilmList.innerHTML = '';
  // Criando uma section para cada filme e adicionando section a imagem e a descrições do filme
  const createSection = createElement('section', 'filme', false, imdbID);
  const thumbnail = Poster;
  const background = createImg('imgTest', thumbnail, Plot); // Cria o background
  const description = createElement('div', 'description', ''); // Cria a div de descrição
  createSection.appendChild(background); createSection.appendChild(description); // Adiciona a imagem e a div à section

  // Criando os botões, a classificação, e o overview a ser adicionados na descrição
  const trailerBtn = createElement('a', 'btn-trailer ui inverted red button', 'Ver Trailer'); trailerBtn.target = '_blank';
  const netflixBtn = createElement('a', '', ''); trailerBtn.target = '_blank';
  const watchlistBtn = createElement('button', `btn-watchlist ui inverted blue button`, '', imdbID);
  const btnsDiv = createElement('div', `btnsDiv`, '');
  netflixBtn.innerHTML = `<i class="play circle huge icon"></i>`
  netflixBtn.href = `https://www.netflix.com/search?q=${Title}`; netflixBtn.target = '_blank'
  watchlistBtn.innerHTML = `<i class="plus square outline icon"></i>&nbsp;List`;
  description.innerHTML = createHtml(imdbRating, Plot); // Adicionando a classificação e o overview
  btnsDiv.appendChild(trailerBtn); btnsDiv.appendChild(watchlistBtn); // Inclui os botões
  description.appendChild(btnsDiv); description.appendChild(netflixBtn);
  trailerBtn.href = `https://www.youtube.com/results?search_query=${Title + ' trailer'}`;

  getFilmList.appendChild(createSection); // Adiciona a section à lista de filmes;
  addBtnsWatchlistEventListener()
}

let aprove = false;

const filmSearch = async (e) => {
  console.log(e.target.innerHTML)
  const findFilms = allApiData.filter((film) => film.title === e.target.innerHTML);
  getFilmList.innerHTML = '';
  document.querySelector('#page-title').innerHTML = 'Resultados da busca:'
  findFilms.forEach((film) => createMovieCard(film));
  if (findFilms.length < 1) {
    const data = await fetch(`https://www.omdbapi.com/?t=${getSearch.value}&apikey=1b999e04`)
    const dataJson = await data.json()
    const { Title, Poster, imdbRating, Plot, imdbID } = dataJson
    createFilme(Title, Poster, imdbRating, Plot, imdbID);
  }
  removeBanner();
  aprove = false;
}


getSearch.forEach((item, index) => item.addEventListener('change', () => {
  item.value !== '' ?
  setTimeout( async() => {
    const findFilms = allApiData.filter((film) => film.title.toLowerCase().includes(getSearch[index].value.toLowerCase()));
    getFilmList.innerHTML = '';
    document.querySelector('#page-title').innerHTML = 'Resultados da busca:'
    findFilms.forEach((film) => createMovieCard(film));
    if (findFilms.length < 1) {
      const data = await fetch(`https://www.omdbapi.com/?t=${getSearch.value}&apikey=1b999e04`)
      const dataJson = await data.json()
      const { Title, Poster, imdbRating, Plot, imdbID } = dataJson
      createFilme(Title, Poster, imdbRating, Plot, imdbID);
    }
    removeBanner();
  }, 500)
  : console.log('vazio');
}));


getSearch.forEach((item, index) => item.addEventListener('keyup', async (e) => {
  if (item.value !== '') {
  if (e.keyCode === 13) {
    const findFilms = allApiData.filter((film) => film.title.toLowerCase().includes(getSearch[index].value.toLowerCase()));
    getFilmList.innerHTML = '';
    document.querySelector('#page-title').innerHTML = 'Resultados da busca:'
    findFilms.forEach((film) => createMovieCard(film));
    if (findFilms.length < 1) {
      const data = await fetch(`https://www.omdbapi.com/?t=${getSearch.value}&apikey=1b999e04`)
      const dataJson = await data.json()
      const { Title, Poster, imdbRating, Plot, imdbID } = dataJson
      createFilme(Title, Poster, imdbRating, Plot, imdbID);
    }
    removeBanner();
  }
}}));
