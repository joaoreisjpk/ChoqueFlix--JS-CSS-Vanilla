import { listaDeFilmes, apiKey, urlImg, getFilmList, getTrailerLink, createImg, createElement } from './main.js';

const genresObj = {// Chaves são conteúdo das opções de categoria e valores são Ids de gêneros
  'Ação': 28,
  'Aventura': 12,
  'Comédia': 35,
  'Drama': 18,
  'Suspense': 53,
  'Terror': 27
}

// Recebe uma Id de um gênero e retorna a URL para requisição da Api
const urlByGenre = (genreId) => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=prelease_date.desc`;

// Responsável por listar filmes por gênero
function listByGenre(event) {
  const genre = event.target.innerText;
  const keyId = genresObj[genre];
  listaDeFilmes(urlByGenre(keyId));
}

const urlByRank = () => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_count.desc`;
const listByRank = () => listaDeFilmes(urlByRank());

const urlBySuccess = () => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=revenue.desc`
const listBySuccess = () => listaDeFilmes(urlBySuccess());

const randomId = () => parseInt((Math.random() * 62) * 100);
const randomUrl = () => `https://api.themoviedb.org/3/movie/${randomId()}?api_key=${apiKey}`;

async function randomChoice(item) {
  getDiv.innerHTML = '';
  const { title, vote_average, poster_path, overview, id } = item;
  const thumbnail = urlImg + poster_path;
  const title2 = title;
  const note = vote_average;
  const img = createImg('imgTest', thumbnail, overview);
  const div = createElement('div', 'filme', false, id);
  const h2 = createElement('h2', 'filmTitle', `${title2} ${note}`);
  const trailerBtn = createElement('a', 'btn-trailer', 'Ver Trailer');
  trailerBtn.target = '_blank';
  div.appendChild(img);
  div.appendChild(h2);
  div.appendChild(trailerBtn);
  getDiv.appendChild(div);
  div.style.margin = 'auto';
  const trailerLink = await getTrailerLink(id);
  if (trailerLink) {
    trailerBtn.href = trailerLink;
  } else { trailerBtn.innerText = 'Trailer indisponível'}
}

async function getRandomChoice() {
  const tries = await fetch(randomUrl());
  const itemJson = await tries.json();
  if (itemJson.poster_path) randomChoice(itemJson);
  tryAgain();
}

const tryAgain = () => {
    if (getDiv.innerHTML === '') getRandomChoice();
};

export { genresObj, urlByGenre, listByGenre, listByRank, listBySuccess, getRandomChoice };
