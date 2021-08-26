import { listByGenre, listByRank, listBySuccess, getRandomChoice } from './navBar.js';
import { getBannerLinks, getTrendingFilms } from './banner.js';
import { addBtnsWatchlistEventListener, listWatchlist } from './watchlist.js';

const apiKey = 'ca19804bba1e445e3db2ec8fbecda738';
const mainUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
const urlImg = 'https://www.themoviedb.org/t/p/w220_and_h330_face';
const getDiv = document.getElementById('film-list');

document.getElementById('watchlist').addEventListener('click', listWatchlist);
document.getElementById('inicio').addEventListener('click', () => listaDeFilmes(mainUrl));
document.getElementById('top-votes').addEventListener('click', listByRank);
document.getElementById('sucessos').addEventListener('click', listBySuccess);
document.getElementById('random-choice').addEventListener('click', getRandomChoice);

function createElement(element, className, content, id) {
  const el = document.createElement(element);
  el.className = className;
  if (content) el.innerHTML = content;
  if (id) el.id = id;
  return el;
}

function createImg(className, source, alt) {
  const img = document.createElement('img');
  img.className = className;
  img.src = source;
  img.alt = alt;
  return img;
}

// adiciona uma frase 'loading' enquanto se faz a requisição da API
// const carregando = async () => {
//   const section = document.createElement('section');
//   section.innerHTML = 'Loading...';
//   section.className = 'loading';
//   document.querySelector('#film-list').appendChild(section);
// };

async function getTrailerLink(id) {
  const fetchUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`;
  const data = await fetch(fetchUrl);
  const json = await data.json();
    const trailerType = (json.results) ?
      (json.results.find(({ type }) => type === 'Trailer')) : false;
    if (trailerType){
      const trailerLink = `https://www.youtube.com/watch?v=${trailerType.key}`;
      return trailerLink;
    }
}

const listaDeFilmes = async (urlApi) => {
  // carregando();
  getDiv.innerHTML = '';
  const lista = await fetch(urlApi);
  const listaJson = await lista.json();
  listaJson.results.forEach(async ({ title, vote_average, poster_path, overview, id }) => {
    if (poster_path) {
      const thumbnail = urlImg + poster_path;
      const title2 = title;
      const note = vote_average;
      const img = createImg('imgTest', thumbnail, overview);
      const div = createElement('div', 'filme', false, id);
      const h2 = createElement('h2', 'filmTitle', `${title2} ${note}`);
      const btnsDiv = createElement('div', 'btns-div', '')
      const trailerBtn = createElement('a', 'btn-trailer', 'Ver Trailer');
      trailerBtn.target = '_blank';
      const watchlistBtn = createElement('button', `btn-watchlist`, '', id);
      const plusIcon = createElement('span', `material-icons`, 'add', id);
      btnsDiv.appendChild(trailerBtn);
      btnsDiv.appendChild(watchlistBtn);
      watchlistBtn.appendChild(plusIcon);
      div.appendChild(img);
      div.appendChild(h2);
      div.appendChild(btnsDiv);
      getDiv.appendChild(div);
      const trailerLink = await getTrailerLink(id);
      if (trailerLink) {
        trailerBtn.href = trailerLink;
      } else {
        trailerBtn.innerText = 'Trailer indisponível';
        trailerBtn.style.cursor = 'not-allowed';
      }
    }
    addBtnsWatchlistEventListener();
  });
};

window.onload = async () => {
  listaDeFilmes(mainUrl);
  const trendingMovies = await getTrendingFilms()
  getBannerLinks(trendingMovies);

  document.querySelectorAll('.options li')
    .forEach((li) => li.addEventListener('click', listByGenre));
};

export { listaDeFilmes, apiKey, urlImg, getDiv, getTrailerLink, createImg, createElement, addBtnsWatchlistEventListener };
