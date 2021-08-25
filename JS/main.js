import { genresObj, urlByGenre, listByGenre } from './navBar.js';
import { getBannerLinks, getTrendingFilms } from './banner.js'

const apiKey = 'ca19804bba1e445e3db2ec8fbecda738';
const mainUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
const urlImg = 'https://www.themoviedb.org/t/p/w220_and_h330_face';
const getDiv = document.getElementById('film-list');
const getIMG = document.getElementById('imgtest');
const getTitle = document.getElementById('titleTest');
const localStorageList = [];
document.getElementById('inicio').addEventListener('click', () => listaDeFilmes(mainUrl));

function createElement(element, className, content, id) {
  const el = document.createElement(element);
  el.className = className;
  if (content) el.innerHTML = content;
  if (id) el.id = id;
  return el;
};

function createImg(className, source, alt) {
  const img = document.createElement('img');
  img.className = className;
  img.src = source;
  img.alt = alt;
  return img;
};

/* const carregando = async () => {
  const section = document.createElement('section');
  section.innerHTML = 'Loading...';
  section.className = 'loading';
  document.querySelector('#film-list').appendChild(section);
}; */

// adiciona uma frase 'loading' enquanto se faz a requisição da API

async function getTrailerLink(id) {
  const data = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos`)
  const json = await data.json();
  if (!json.hasOwnProperty('sucess')) { // só vai ter a propriedade sucesso quando ocorer algum erro na requsição 
    if (json.videos && json.videos.results.length > 0){
      if (json.videos.results[0].key !== null){
        const trailerLink = `https://www.youtube.com/watch?v=${json.videos.results[0].key}`
        return trailerLink;
      }
    }
  }
}

function addMovieToWatchlist(event) {
  const movieHTML = event.target.parentNode.innerHTML;
  localStorageList.push(movieHTML);
  localStorage.setItem('watchlist', JSON.stringify(localStorageList))
}

function addBtnsWatchlistEventListener() {
  const btnsWatchlist = document.getElementsByClassName('btn-watchlist');
  [...btnsWatchlist].forEach((btn) => {
    btn.addEventListener('click', addMovieToWatchlist)
  })
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
      const watchlistBtn = createElement('button', 'btn-watchlist', '');
      const plusIcon = createElement('span', 'material-icons', 'add');
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
      } else { trailerBtn.innerText = 'Trailer indisponível'}
    }
  });
};

window.onload = async () => {
  listaDeFilmes(mainUrl);
  const trendingMovies = await getTrendingFilms()
  getBannerLinks(trendingMovies);

  document.querySelectorAll('.options li')
    .forEach((li) => li.addEventListener('click', listByGenre));
};

export { listaDeFilmes, apiKey };
