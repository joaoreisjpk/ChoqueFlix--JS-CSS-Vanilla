import { createElement, createImg, urlImg, getTrailerLink, apiKey, getFilmList, getLocalStorageWatchlist } from './main.js'
import { getName} from './watchlist.js'
let currentBannerIndex = Math.floor(Math.random() * 19) + 0;
const bannerDiv = document.querySelector('.banner');

function getCardBannerInfos() {
  return {
    title: document.querySelector('.movie-title').innerText,
    poster_path: document.querySelector('.poster-img').src,
    vote_average: +(document.querySelector('.nota--value').innerText),
    overview: document.querySelector('.banner-description').innerText,
    btns: document.querySelector('.banner .btnsDiv').innerHTML,
  };
}

function createCardFromBanner(object) {
  const { title, vote_average, poster_path, overview, btns } = object;
  const cardDiv = createElement('div', 'filme');

  // Adicionando à section a imagem e a descrições do filme
  const thumbnail = urlImg + poster_path;
  const background = createImg('imgTest', thumbnail, overview); // Cria o background
  const description = createElement('div', 'description'); // Cria a div de descrição
  cardDiv.appendChild(background); cardDiv.appendChild(description); // Adiciona a imagem e a div à section

  // Criando os botões, a classificação, e o overview a ser adicionados na descrição
  const netflixBtn = createElement('a', '', '');
  const btnsDiv = createElement('div', `btnsDiv`);
  netflixBtn.innerHTML = `<i class="play circle huge icon"></i>`
  netflixBtn.href = `https://www.netflix.com/search?q=${title}`; netflixBtn.target = '_blank'
  description.innerHTML = createHtml(vote_average, overview); // Adicionando a classificação e o overview
  btnsDiv.innerHTML = btns; // Inclui os botões
  description.appendChild(btnsDiv); description.appendChild(netflixBtn);
  return cardDiv;
}

const addCardBannerToStorage = () => {
  const card = createCardFromBanner(getCardBannerInfos());
  if (!localStorageList.includes(card.innerHTML)) {
    localStorageList.push(card.innerHTML);
    localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
  }
}

const removeBanner = () => {
  document.querySelector('.banner-div').style.display = 'none';
  getFilmList.style.marginTop = '5%';
}

function getMubiImgLink(query, year) {
  bannerDiv.innerText = '';
  const imgLink = fetch(`https://mubi.com/services/api/search?query=${query}`)
  .then((data) => data.json())
    .then(json => json.films)
    .then((moviesList) => moviesList.find((movie) => movie.year == year && movie.title === query))
    .then((movie) => { 
      if(movie) return movie.still_url;
      //displayBanner()
    })
  if(imgLink) {
    return imgLink;
  }
}

let bannerInfoArray = [];

async function getBannerMoviesInfo() {
  const randomPage = Math.floor(Math.random() * 10) + 1
  const results = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=ca19804bba1e445e3db2ec8fbecda738&sort_by=revenue.desc&page=${randomPage}`)  
  const json = await results.json();
  const infos = await json.results;

  //onst {title, overview, release_date, id, vote_average, poster_path} = infos;
  bannerInfoArray = infos.map(async ({title, overview, id, vote_average, poster_path, release_date}) =>{
    const thumbnail = urlImg + poster_path;
    const year = release_date ? release_date.match(/\d{4}/) : undefined;
    const imgLink = await getMubiImgLink(title, year);
    if (imgLink) bannerInfoArray.push({title, overview, year, id, vote_average, thumbnail, imgLink})
  })
  return bannerInfoArray;
}

function verifyInfoBanner(year) {
  if (year === undefined) {
    console.log('Repetindo requisição de banner');
    return false;
  }
  return true;
}
function newDisplayBanner() {
  const bannerImgsDiv = createElement('div', 'banner-imgs-div', false);
  bannerDiv.appendChild(bannerImgsDiv);
  getBannerMoviesInfo().then((bannerInfoArray) => {
    console.log(bannerInfoArray);
    bannerInfoArray.forEach((movieObj) => {
      const bannerImg = createImg('banner-img', movieObj.imgLink, movieObj.title);
      bannerImgsDiv.appendChild(bannerImg);
    })
    const loader = document.querySelector('#loader-div')
    if(loader) loader.remove();
  })
}
async function displayBanner() {
  await getBannerMoviesInfo();
  const bannerImgsDiv = createElement('div', 'banner-imgs-div', false);
  bannerInfoArray.forEach(({imgLink}) => {
    const bannerImg = createImg('banner-img', imgLink, title);
    bannerImgsDiv.appendChild(bannerImg);
  })
  const {title, overview, id, vote_average, imgLink, thumbnail, year} = bannerInfoArray[0];
  const posterImg = createImg('poster-img', thumbnail, 'imagem do poster');
  const posterAndInfoDiv = createElement('div', 'poster-and-info-div');
  const infoDiv = createElement('div', 'movie-info-div');
  const titleElement = createElement('h2', 'movie-title', title.toUpperCase());
  infoDiv.appendChild(titleElement);
  if (year) {
    const releaseYear = createElement('p', 'release-year',  `Ano de lançamento: ${year}`)
    infoDiv.appendChild(releaseYear);
  }
  const notaDiv = createElement('div', 'nota', 'Classificação: ');
  const nota = createElement('span', 'nota--value', vote_average.toFixed(1))
  notaDiv.appendChild(nota);
  infoDiv.appendChild(notaDiv);
  const newOverview = overview.match(/.{500}/) ? overview.match(/.{500}/)[0] + '...' : overview;
  const descriptionDiv = createElement('p', 'banner-description', newOverview)
  infoDiv.appendChild(descriptionDiv)
  const trailerBtn = createElement('a', 'btn-trailer ui inverted red button', 'Ver Trailer'); trailerBtn.target = '_blank';
  const trailerLink = await getTrailerLink(id);
  if (trailerLink) {
    trailerBtn.href = trailerLink;
  } else {
    trailerBtn.innerText = 'Trailer indisponível'
    trailerBtn.className = 'btn-trailer ui inverted grey button unavailable';
  }
  const watchlistBtn = createElement('button', 'btn-watchlist-banner ui inverted blue button', false, id);
  let localStorageList = getLocalStorageWatchlist();
  let isOnWatchlist = localStorageList.some((movieObj) => movieObj.id === id);
  watchlistBtn.innerHTML = isOnWatchlist ? 'Remover' : '<i class="plus square outline icon"></i>&nbsp;List';

  watchlistBtn.addEventListener('click', (btn) => {
    localStorageList = getLocalStorageWatchlist();
    isOnWatchlist = localStorageList.some((movieObj) => parseInt(movieObj.id) === parseInt(id));
    if (!isOnWatchlist) { // se não estiver na watchlist
      localStorageList.push({ title, vote_average, overview, id, thumbnail, isWatchlistItem: true});
      localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
      watchlistBtn.innerHTML = 'Remover';
    } else if(isOnWatchlist){ // se estiver
      localStorageList = localStorageList.filter((movieObj) => parseInt(movieObj.id) != id);
      localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
      btn.target.innerHTML = '<i class="plus square outline icon"></i>&nbsp;List';
    }
  })
  const btnsDiv = createElement('div', `btnsDiv`);
  btnsDiv.appendChild(trailerBtn); 
  btnsDiv.appendChild(watchlistBtn);
  posterAndInfoDiv.appendChild(posterImg);
  posterAndInfoDiv.appendChild(infoDiv);
  posterAndInfoDiv.appendChild(btnsDiv);
  bannerDiv.appendChild(bannerImgsDiv);
  bannerDiv.appendChild(posterAndInfoDiv);
  const loader = document.querySelector('#loader-div')
  if(loader) loader.remove();
}

function displayAndVerifyBanner() {
  //displayBanner();
/*   setTimeout(() => {
    if (!document.querySelector('.poster-and-info-div')) //displayBanner();
  }, 10000); */
}


export { getBannerMoviesInfo, displayAndVerifyBanner, removeBanner, displayBanner, newDisplayBanner }
