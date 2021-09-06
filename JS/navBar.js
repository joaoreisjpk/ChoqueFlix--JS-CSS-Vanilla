import { listaDeFilmes, apiKey, getFilmList, createMovieCard, intervalId } from './main.js';
import { removeBanner } from './banner.js';

const genresObj = {// Chaves são conteúdo das opções de categoria e valores são Ids de gêneros
  'Ação': 28,
  'Aventura': 12,
  'Comédia': 35,
  'Drama': 18,
  'Suspense': 53,
  'Terror': 27
}

const pageUrl = (url, page) => `${url}&page=${page}`;

function pageEvent() {
  document.querySelector('#page-list')
    .innerHTML = `<span><i class="angle large left icon"></i></span>
    <span class="page">1</span>
    <span class="page">2</span>
    <span class="page">3</span>
    <span class="page">4</span>
    <span class="page page-5">5</span>
    <span class="page page-6">6</span>
    <span class="page page-7">7</span>
    <span class="page page-8">8</span>
    <span class="page page-9">9</span>
    <span class="page page-10">10</span>
    <span><i class="angle large right icon"></i></span>`
  if (intervalId) clearInterval(intervalId);
}

// Recebe uma Id de um gênero e retorna a URL para requisição da Api
const urlByGenre = (genreId) => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=prelease_date.desc`;

// Responsável por listar filmes por gênero
function listByGenre(event) {
  removeBanner();
  const genre = event.target.innerText;
  console.log(event.target);
  const keyId = genresObj[genre];
  listaDeFilmes(urlByGenre(keyId), genre);
  pageEvent();

  document.querySelectorAll('.page').forEach((page) => {
    page.addEventListener('click', () =>
      listaDeFilmes(pageUrl(urlByGenre(keyId), page.innerHTML), genre));
  });
}

const urlByRank = () => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_count.desc`;
const listByRank = () => {
  removeBanner();
  listaDeFilmes(urlByRank(), 'Filmes Mais Votados');
  pageEvent();

  document.querySelectorAll('.page').forEach((page) => {
    page.addEventListener('click', () => listaDeFilmes(pageUrl(urlByRank(), page.innerHTML), `Filmes Mais Votados`));
  });
}

const urlBySuccess = () => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=revenue.desc`

const listBySuccess = () => {
  removeBanner();
  listaDeFilmes(urlBySuccess(), 'Sucessos de Bilheteria');
  pageEvent();
  document.querySelectorAll('.page').forEach((page) => {
    page.addEventListener('click', () =>
    listaDeFilmes(pageUrl(urlBySuccess(), page.innerHTML), `Sucessos de Bilheteria`));
  });
}

const randomId = () => parseInt(Math.random() * ((Math.random() + 1) * 100000));
const randomUrl = () => `https://api.themoviedb.org/3/movie/${randomId()}?api_key=${apiKey}`;

async function getRandomChoice() {
  const pageTitle = document.querySelector('#page-title');
  if (pageTitle.innerHTML !== 'Roleta Choqueflix') getFilmList.innerHTML = '';
  pageTitle.innerHTML = 'Roleta Choqueflix';
  document.querySelector('#page-list').style = 'visibility: hidden';
  const tryUrl = randomUrl();
  const tries = await fetch(tryUrl);
  const itemJson = await tries.json();
  (itemJson.poster_path) ? await createMovieCard(itemJson) : tryAgain();
  document.querySelectorAll('.filme').forEach((card) => card.style.margin = 'auto');
}

const tryAgain = () => getRandomChoice();

export { genresObj, urlByGenre, listByGenre, listByRank, listBySuccess, getRandomChoice, pageEvent, pageUrl, urlBySuccess, intervalId };
