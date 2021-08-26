import { createElement, createImg, urlImg } from './main.js'
const bannerDiv = document.querySelector('.banner')
let currentBannerIndex = Math.floor(Math.random() * 19) + 0;

async function displayBanner() {
  const bannerMoviesInfos = await getBannerMoviesInfo();
  const {title, overview, vote_average, imgLink, poster } = bannerMoviesInfos;
  console.log(bannerMoviesInfos);
  const bannerImg = createImg('banner-img', imgLink, title);
  bannerDiv.appendChild(bannerImg);
  const posterAndInfoDiv = createElement('div', 'poster-and-info-div', false);
  const infoDiv = createElement('div', 'movie-info-div', false);
  const posterImg = createImg('poster-img', poster, 'imagem do poster');
  const titleElement = createElement('h2', 'movie-title', title)
  infoDiv.appendChild(titleElement);
  const notaDiv = createElement('div', 'nota', "Classificação: ");
  const nota = createElement('span', 'nota--value', vote_average)
  notaDiv.appendChild(nota);
  infoDiv.appendChild(notaDiv);
  const descriptionDiv = createElement('p', 'banner-description', overview)
  infoDiv.appendChild(descriptionDiv)
  const trailerBtn = createElement('a', 'btn-trailer ui inverted red button', 'Ver Trailer'); trailerBtn.target = '_blank';
  const watchlistBtn = createElement('button', `btn-watchlist ui inverted blue button`, '');
  const btnsDiv = createElement('div', `btnsDiv`, '');
  watchlistBtn.innerHTML = `<i class="plus square outline icon"></i>&nbsp;List`;
  btnsDiv.appendChild(trailerBtn); 
  btnsDiv.appendChild(watchlistBtn);
  posterAndInfoDiv.appendChild(posterImg);
  posterAndInfoDiv.appendChild(infoDiv);
  posterAndInfoDiv.appendChild(btnsDiv);
  bannerDiv.appendChild(posterAndInfoDiv);
}

function getBannerImgLink(query) {
  const imgLink = fetch(`https://mubi.com/services/api/search?query=${query}`)
  .then((data) => data.json())
    .then(json => json.films)
    .then((moviesList) => moviesList[0].still_url);
  return imgLink;
}

async function getBannerMoviesInfo() {
  //let bannerMoviesInfos = [];
  const results = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=ca19804bba1e445e3db2ec8fbecda738`)
  const json = await results.json();
  const infos = await json.results[currentBannerIndex];

    const {title, overview, realese_date, id, vote_average, genre_ids, poster_path} = infos;
    const poster = urlImg + poster_path;
    const imgLink = await getBannerImgLink(title);
    return {title, overview, realese_date, id, vote_average, imgLink, genre_ids, poster};
    //.then(localStorage.setItem('bannerInfo', JSON.stringify(bannerMoviesInfos)));
  
}
//getBannerMoviesInfo();
displayBanner();
window.onload = async () => {
/*   getBannerMoviesInfo();
  displayBanner(); */
}
export { getBannerMoviesInfo, displayBanner }