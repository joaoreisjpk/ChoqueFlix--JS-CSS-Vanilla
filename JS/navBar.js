import { listaDeFilmes, apiKey, urlImg, mainUrl, getFilmList, getTrailerLink, createImg, createElement, createHtml, addBtnsWatchlistEventListener } from './main.js';

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
    .innerHTML = `<span><</span>
    <span class="page">1</span>
    <span class="page">2</span>
    <span class="page">3</span>
    <span class="page">4</span>
    <span class="page">5</span>
    <span class="page">6</span>
    <span class="page">7</span>
    <span class="page">8</span>
    <span class="page">9</span>
    <span class="page">10</span>
    <span>></span>`
}

// Recebe uma Id de um gênero e retorna a URL para requisição da Api
const urlByGenre = (genreId) => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=prelease_date.desc`;

// Responsável por listar filmes por gênero
function listByGenre(event) {
  const genre = event.target.innerText;
  const keyId = genresObj[genre];
  listaDeFilmes(urlByGenre(keyId));
  pageEvent();
  const genrePages = (eventPage) => listaDeFilmes(pageUrl(urlByGenre(keyId), eventPage.target.innerHTML));
  document.querySelectorAll('.page').forEach((page) => {
    page.addEventListener('click', genrePages);
  })
}

const urlByRank = () => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_count.desc`;
const listByRank = () => listaDeFilmes(urlByRank());

const urlBySuccess = () => `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=revenue.desc`
const listBySuccess = () => listaDeFilmes(urlBySuccess());

const randomId = () => parseInt((Math.random() * 62) * 1000);
const randomUrl = () => `https://api.themoviedb.org/3/movie/${randomId()}?api_key=${apiKey}`;

async function randomChoice(item) {
  getFilmList.innerHTML = '';
  const { vote_average, poster_path, overview, id } = item;
  const createSection = createElement('section', 'filme', false, id);
  createSection.style.margin = 'auto';

  // Adicionando à section a imagem e a descrições do filme
  const thumbnail = urlImg + poster_path;
  const background = createImg('imgTest', thumbnail, overview); // Cria o background
  const description = createElement('div', 'description', ''); // Cria a div de descrição
  createSection.appendChild(background); createSection.appendChild(description); // Adiciona a imagem e a div à section
  
  // Criando os botões, a classificação, e o overview a ser adicionados na descrição
  const trailerBtn = createElement('a', 'btn-trailer ui inverted red button', 'Ver Trailer'); trailerBtn.target = '_blank';
  const watchlistBtn = createElement('button', `btn-watchlist ui inverted blue button`, '', id);
  const btnsDiv = createElement('div', `btnsDiv`, '');
  watchlistBtn.innerHTML = `<i class="plus square outline icon"></i>&nbsp;List`;
  description.innerHTML = createHtml(vote_average, overview); // Adicionando a classificação e o overview
  btnsDiv.appendChild(trailerBtn); btnsDiv.appendChild(watchlistBtn); // Inclui os botões
  description.appendChild(btnsDiv);

  const trailerLink = await getTrailerLink(id);
  if (trailerLink) {
    trailerBtn.href = trailerLink;
  } else { trailerBtn.innerText = 'Trailer indisponível'}

  getFilmList.appendChild(createSection);
  addBtnsWatchlistEventListener();
}

async function getRandomChoice() {
  const tries = await fetch(randomUrl());
  const itemJson = await tries.json();
  if (itemJson.poster_path) randomChoice(itemJson);
  tryAgain();
}

const tryAgain = () => {
  setTimeout(() => {
    if (getFilmList.innerHTML === '') getRandomChoice();
  }, 400);
};

export { genresObj, urlByGenre, listByGenre, listByRank, listBySuccess, getRandomChoice, pageEvent, pageUrl };
