import { createElement, createImg, urlImg } from './main.js'
const bannerDiv = document.querySelector('.banner')
let currentBannerIndex = Math.floor(Math.random() * 19) + 0;

async function displayBanner() {
  const bannerMoviesInfos = await getBannerMoviesInfo();
  const {title, overview, id, vote_average, imgLink, genre_ids, poster, year} = bannerMoviesInfos;
  console.log(bannerMoviesInfos);
  const bannerImg = createImg('banner-img', imgLink, title);
  bannerDiv.appendChild(bannerImg);
  const posterAndInfoDiv = createElement('div', 'poster-and-info-div', false);
  const infoDiv = createElement('div', 'movie-info-div', false);
  const posterImg = createImg('poster-img', poster, 'imagem do poster');
  const titleElement = createElement('h2', 'movie-title', title.toUpperCase());
  infoDiv.appendChild(titleElement);
  const releaseYear = createElement('p', 'release-year',  `Ano de lançamento: ${year}`)
  infoDiv.appendChild(releaseYear);
  const notaDiv = createElement('div', 'nota', "Classificação: ");
  const nota = createElement('span', 'nota--value', vote_average.toFixed(1))
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

function getMubiImgLink(query, year) {
  const imgLink = fetch(`https://mubi.com/services/api/search?query=${query}`)
  .then((data) => data.json())
    .then(json => json.films)
    .then((moviesList) => moviesList.find((movie) => movie.year == year && movie.title === query))
    .then((movie) => movie ? movie.still_url : getBannerMoviesInfo());
  return imgLink;
}

async function getBannerMoviesInfo() {
  const randomPage = Math.floor(Math.random() * 6) + 1
  const results = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=ca19804bba1e445e3db2ec8fbecda738&page=${randomPage}`)
  const json = await results.json();
  const infos = await json.results[currentBannerIndex];

    const {title, overview, release_date, id, vote_average, genre_ids, poster_path} = infos;
    const year = release_date.match(/\d{4}/);
    const poster = urlImg + poster_path;
    const imgLink = await getMubiImgLink(title, year);
    return {title, overview, id, vote_average, imgLink, genre_ids, poster, year};
    //.then(localStorage.setItem('bannerInfo', JSON.stringify(bannerMoviesInfos)));
  
}
//getBannerMoviesInfo();
displayBanner();
window.onload = async () => {
/*   getBannerMoviesInfo();
  displayBanner(); */
}
export { getBannerMoviesInfo, displayBanner }