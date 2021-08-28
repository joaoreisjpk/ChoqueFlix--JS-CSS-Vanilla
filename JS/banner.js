import { createElement, createImg, urlImg, getTrailerLink, apiKey, getFilmList, getLocalStorageWatchlist } from './main.js'
import { getName} from './watchlist.js'
let currentBannerIndex = Math.floor(Math.random() * 19) + 0;
const bannerDiv = document.querySelector('.banner');

const removeBanner = () => {
  document.querySelector('.banner-div').style.display = 'none';
  getFilmList.style.marginTop = '5%';
}

function getMubiImgLink(query, year) {
  bannerDiv.innerText = '';
  const imgLink = fetch(`https://mubi.com/services/api/search?query=${query}`)
  .then((data) => data.json())
    .then(json => json.films)
    .then((moviesList) => moviesList.find((movie) => movie.year == year && movie.title.toLowerCase() === query.toLowerCase()))
    .then((movie) => { 
      if(movie) return movie.still_url;
      displayBanner()
    })
  if(imgLink) {
    return imgLink;
  }
}

async function getBannerMoviesInfo() {
  const randomPage = Math.floor(Math.random() * 15) + 1
  const results = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=revenue.desc&page=${randomPage}`)  
  const json = await results.json();
  const infos = await json.results[currentBannerIndex];

  const {title, overview, release_date, id, vote_average, poster_path} = infos;
  const year = release_date ? release_date.match(/\d{4}/) : undefined;
  const thumbnail = urlImg + poster_path;
  if (verifyInfoBanner(year)) {
    const imgLink = await getMubiImgLink(title, year);
    return {title, overview, id, vote_average, imgLink, thumbnail, year};  
  }
}

function verifyInfoBanner(year) {
  if (year === undefined) {
    console.log('Repetindo requisição de banner');
    return false;
  }
  return true;
}

async function displayBanner() {
  const bannerMoviesInfos = await getBannerMoviesInfo();
  if (bannerMoviesInfos.imgLink) {
    const {title, overview, id, vote_average, imgLink, thumbnail, year} = bannerMoviesInfos;
    const bannerImg = createImg('banner-img', imgLink, title);
    const posterAndInfoDiv = createElement('div', 'poster-and-info-div');
    const infoDiv = createElement('div', 'movie-info-div');
    const posterImg = createImg('poster-img', thumbnail, 'imagem do poster');
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
    let isOnWatchlist = localStorageList.some(({ id: movieId }) => +(movieId) === id);
    watchlistBtn.innerHTML = isOnWatchlist ? 'Remover' : '<i class="plus square outline icon"></i>&nbsp;List';

    watchlistBtn.addEventListener('click', (btn) => {
      localStorageList = getLocalStorageWatchlist();
      isOnWatchlist = localStorageList.some(({ id: movieId }) => +(movieId) === +(id));
      if (!isOnWatchlist) { // se não estiver na watchlist
        localStorageList.push({ title, vote_average, overview, id, thumbnail, isWatchlistItem: true});
        localStorage.setItem(`watchlist-${getName}`, JSON.stringify(localStorageList));
        watchlistBtn.innerHTML = 'Remover';
      } else if(isOnWatchlist){ // se estiver
        localStorageList = localStorageList.filter(({ id: movieId }) => +(movieId) != id);
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
    bannerDiv.appendChild(bannerImg);
    bannerDiv.appendChild(posterAndInfoDiv);
    const loader = document.querySelector('#loader-div')
    if(loader) loader.remove();
  }
}

function displayAndVerifyBanner() {
  displayBanner();
  setTimeout(() => {
    if (!document.querySelector('.poster-and-info-div')) displayBanner();
  }, 10000);
}


export { getBannerMoviesInfo, displayAndVerifyBanner, removeBanner }
