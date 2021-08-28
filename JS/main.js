
import { listByGenre, listByRank, listBySuccess, getRandomChoice, pageEvent, pageUrl } from './navBar.js';
import { displayAndVerifyBanner, removeBanner, displayBanner, newDisplayBanner } from './banner.js'
import { addBtnsWatchlistEventListener, addRemoveFromWatchlistEventListeners, listWatchlist, getName } from './watchlist.js'

document.querySelector('.search').innerHTML += `<a href='./index.html'>
  <div class='perfil'>
    <img src='./images${localStorage.getItem('perfil').split('images')[1]}' class='perfilImg'>
    <i class="angle down icon"></i>
  </div>
</a>`;

const apiKey = 'ca19804bba1e445e3db2ec8fbecda738';
const mainUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

const urlImg = 'https://www.themoviedb.org/t/p/w220_and_h330_face';
const getFilmList = document.getElementById('film-list');
const getFocus = document.querySelectorAll('.navFocus')
const getLocalStorageWatchlist = () => localStorage.getItem(`watchlist-${getName}`) ?
JSON.parse(localStorage.getItem(`watchlist-${getName}`)) : [];

document.getElementById('watchlist').addEventListener('click', () => {
  removeBanner();
  listWatchlist();
})

document.getElementById('inicio').addEventListener('click', async () => {
  document.querySelector('.banner-div').style.display = 'block';
  getFilmList.style.marginTop = '0';
  listaDeFilmes(mainUrl);
  pageEvent();
  document.querySelectorAll('.page').forEach((page) => {
    page.addEventListener('click', () => listaDeFilmes(pageUrl(mainUrl, page.innerHTML)))
  });
});

document.getElementById('top-votes').addEventListener('click', () => {
  removeBanner()
  listByRank()
});
document.getElementById('sucessos').addEventListener('click', () => {
  removeBanner();
  listBySuccess()
});
document.getElementById('random-choice').addEventListener('click', () => {
  removeBanner()
  getRandomChoice()
});

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

async function getTrailerLink(id) {
  const fetchUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`;
  const data = await fetch(fetchUrl);
  const json = await data.json();
    const trailerType = (json.results) ?
      (json.results.find(({ type }) => type === 'Trailer')) : false;
    if (trailerType) {
      const trailerLink = `https://www.youtube.com/watch?v=${trailerType.key}`;
      return trailerLink;
    };
};

const createHtml = (nota, description) =>
  `<div class='description'>
    <div class='nota'>Classificação: 
      <span class='nota--value'>${nota.toFixed(1)}</span>
    </div>
    <div class='description'>Descrição: 
      <spam class='description--text'>
        ${description. length > 150 ? description.slice(0, 150) + '...' : description}
      <span>
    </div>
  </div>`

const createMovieCard = async ({ title, vote_average, poster_path, overview, id, thumbnail, isWatchlistItem }) => {
  if (poster_path || thumbnail) {
    // Criando uma section para cada filme
    const sectionClassName = isWatchlistItem === undefined ? `filme` : `filme watchlist-item` // se for um item da watchlist terá a clase watchlist-item
    const createSection = createElement('section', sectionClassName, false, id);
    // Adicionando à section a imagem e a descrições do filme
    if (!thumbnail) thumbnail = urlImg + poster_path; // fazendo essa condicional porque thumbnail pode vir da func listWatchlist.
    const background = createImg('imgTest', thumbnail, overview); // Cria o background
    const titleDiv = createElement('h1', 'title-hidden', title); // Cria a div de descrição
    titleDiv.style = 'display:none;';
    createSection.appendChild(titleDiv)
    const description = createElement('div', 'description', ''); // Cria a div de descrição
    createSection.appendChild(background); createSection.appendChild(description); // Adiciona a imagem e a div à section
    
    // Criando os botões, a classificação, e o overview a ser adicionados na descrição
    const trailerBtn = createElement('a', 'btn-trailer ui inverted red button', 'Ver Trailer'); trailerBtn.target = '_blank';
    const netflixBtn = createElement('a', '', ''); trailerBtn.target = '_blank';
    const watchlistBtn = createElement('button', `btn-watchlist ui inverted blue button`, '', id);
    const btnsDiv = createElement('div', `btnsDiv`, '');
    netflixBtn.innerHTML = `<i class="play circle huge icon"></i>`
    netflixBtn.href = `https://www.netflix.com/search?q=${title}`; netflixBtn.target = '_blank'
    let localStorageList = getLocalStorageWatchlist();
    console.log(localStorageList);
    let isOnWatchlist = localStorageList.some((movieObj) => movieObj.id === id);
    watchlistBtn.innerHTML = isOnWatchlist ? `Remover` : `<i class="plus square outline icon"></i>&nbsp;List`;
    description.innerHTML = createHtml(parseFloat(vote_average), overview); // Adicionando a classificação e o overview
    btnsDiv.appendChild(trailerBtn); btnsDiv.appendChild(watchlistBtn); // Inclui os botões
    description.appendChild(btnsDiv); description.appendChild(netflixBtn);
    const trailerLink = await getTrailerLink(id);
    if (trailerLink) {
      trailerBtn.href = trailerLink;
    } else { 
      trailerBtn.innerText = 'Trailer indisponível'
      trailerBtn.className = "btn-trailer ui inverted grey button";
      trailerBtn.classList.add('unavailable');
    }

    getFilmList.appendChild(createSection); // Adiciona a section à lista de filmes;
    isWatchlistItem ? addRemoveFromWatchlistEventListeners() : addBtnsWatchlistEventListener();
  }
}

const listaDeFilmes = async (urlApi) => {
  getFilmList.innerHTML = `<p id="waiting">Buscando conteúdo, aguarde...</p>`;
  const lista = await fetch(urlApi);
  const listaJson = await lista.json();
  listaJson.results.forEach(createMovieCard);
  if (document.querySelector('#waiting')) document.querySelector('#waiting').remove();
  document.querySelector('#page-list').style = 'display: block'
};

function removeActive(e) {
  getFocus.forEach((element) => element.classList.remove('navActive'));
    document.querySelectorAll('.options li')
    .forEach((li) => li.classList.remove('liActive'));

    if (e.target.parentElement.className === 'options') {
      e.target.parentElement.parentElement.classList.add('navActive');
      e.target.className += ' liActive';
    } else e.target.classList.add('navActive');
}

getFocus.forEach((element) => element.addEventListener('click', removeActive));

window.onload = async () => {
  listaDeFilmes(mainUrl);
  newDisplayBanner();
  //displayBanner();
  //displayAndVerifyBanner();
  const interval = setInterval(() => displayAndVerifyBanner(), 60 * 1000);
  document.querySelectorAll('.options li')
    .forEach((li) => li.addEventListener('click', listByGenre));
  
  document.querySelectorAll('.page')
    .forEach((page) => page.addEventListener('click', () => listaDeFilmes(pageUrl(mainUrl, page.innerHTML))));
};

export { listaDeFilmes, apiKey, urlImg, mainUrl, getFilmList, getTrailerLink, createImg, createElement, createHtml, addBtnsWatchlistEventListener, createMovieCard, getLocalStorageWatchlist };
