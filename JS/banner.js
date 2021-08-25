import { apiKey } from './main.js'
let bannersLinks = [];

async function getBannerLinks(array) {
  array.forEach((query) => {
    fetch(`https://mubi.com/services/api/search?query=${query}`)
      .then((data) => data.json())
      .then(json => json.films)
      .then((moviesList) => bannersLinks.push(moviesList[0].still_url))
  })
}

async function getTrendingFilms() {
  const trendingFilms = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`)
    .then(data => data.json())
    .then(json => json.results)
    .then(results => results.map((film) => film.title));

  return trendingFilms;
}

export { getBannerLinks, getTrendingFilms }