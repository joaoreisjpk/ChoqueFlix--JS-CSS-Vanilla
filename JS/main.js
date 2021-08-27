
import { listByGenre, listByRank, listBySuccess, getRandomChoice, pageEvent, pageUrl } from './navBar.js';
import { displayBanner, removeBanner } from './banner.js'
import { addBtnsWatchlistEventListener, listWatchlist } from './watchlist.js'

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

document.getElementById('watchlist').addEventListener('click', () => {
  removeBanner();
  listWatchlist();
})

document.getElementById('inicio').addEventListener('click', async () => {
  const banner = document.querySelector('.banner-div');
  if(banner.style.display === 'none') banner.style.display = 'block';
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
    }
}

const createHtml = (nota, description) =>
  `<div class='description'>
    <div class='nota'>Classificação: 
      <span class='nota--value'>${nota.toFixed(1)}</span>
    </div>
    <div class='description'>Descrição: 
      <spam class='description--text'>${description.slice(0, 150) + '...'}<span>
    </div>
  </div>`

const listaDeFilmes = async (urlApi) => {
  getFilmList.innerHTML = `<p id="waiting">Buscando conteúdo, aguarde...</p>`;
  const lista = await fetch(urlApi);
  const listaJson = await lista.json();
  listaJson.results.forEach(async ({ title, vote_average, poster_path, overview, id }) => {
    if (poster_path) {
      // Criando uma section para cada filme
      const createSection = createElement('section', 'filme', false, id);

      // Adicionando à section a imagem e a descrições do filme
      const thumbnail = urlImg + poster_path;
      const background = createImg('imgTest', thumbnail, overview); // Cria o background
      const description = createElement('div', 'description', ''); // Cria a div de descrição
      createSection.appendChild(background); createSection.appendChild(description); // Adiciona a imagem e a div à section
      
      // Criando os botões, a classificação, e o overview a ser adicionados na descrição
      const trailerBtn = createElement('a', 'btn-trailer ui inverted red button', 'Ver Trailer'); trailerBtn.target = '_blank';
      const netflixBtn = createElement('a', '', ''); trailerBtn.target = '_blank';
      const watchlistBtn = createElement('button', `btn-watchlist ui inverted blue button`, '', id);
      const btnsDiv = createElement('div', `btnsDiv`, '');
      netflixBtn.innerHTML = `<i class="play circle huge icon"></i>`
      netflixBtn.href = `https://www.netflix.com/search?q=${title}`; netflixBtn.target = '_blank'
      watchlistBtn.innerHTML = `<i class="plus square outline icon"></i>&nbsp;List`;
      description.innerHTML = createHtml(vote_average, overview); // Adicionando a classificação e o overview
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
    }
    addBtnsWatchlistEventListener();
  });
  if (document.querySelector('#waiting')) document.querySelector('#waiting').remove();
};

window.onload = async () => {
  listaDeFilmes(mainUrl);
  displayBanner();
  document.querySelectorAll('.options li')
    .forEach((li) => li.addEventListener('click', listByGenre));
  
  document.querySelectorAll('.page')
    .forEach((page) => page.addEventListener('click', () => listaDeFilmes(pageUrl(mainUrl, page.innerHTML))));
};

function removeActive(e) {
  getFocus.forEach(
    (element) => element.classList.remove('navActive')
  );
  document.querySelectorAll('.options li')
    .forEach((li) => li.classList.remove('liActive'));
  
  if (e.target.parentElement.className === 'options') {
    e.target.parentElement.parentElement.classList.add('navActive');
    e.target.className += ' liActive';
  } else e.target.classList.add('navActive');
}

getFocus.forEach((element) => element.addEventListener('click', removeActive));

export { listaDeFilmes, apiKey, urlImg, mainUrl, getFilmList, getTrailerLink, createImg, createElement, createHtml, addBtnsWatchlistEventListener };
