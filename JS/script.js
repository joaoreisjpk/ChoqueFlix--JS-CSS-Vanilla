const apiKey = 'ca19804bba1e445e3db2ec8fbecda738'
const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const urlImg = 'https://www.themoviedb.org/t/p/w220_and_h330_face';
<<<<<<< HEAD

const getDiv = document.getElementById('film-list');
=======
const getDiv = document.getElementById('film-list')
>>>>>>> abe7c29e5f5da6a6691e85c1ae34fc1479ea10dc
const getIMG = document.getElementById('imgtest');
const getTitle = document.getElementById('titleTest');
let bannersLinks = [];

function createElement(element, className, content, id) {
  const el = document.createElement(element);
  el.className = className;
  el.innerText = content;
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

/* const carregando = async () => {
  const section = document.createElement('section');
  section.innerHTML = 'Loading...';
  section.className = 'loading';
  document.querySelector('#film-list').appendChild(section);
}; */

// adiciona uma frase 'loading' enquanto se faz a requisição da API


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

async function getTrailerLink(id) {
  const data = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos`)
  const json = await data.json();
  if (json.videos.results[0]){
    const trailerLink = `https://www.youtube.com/watch?v=${json.videos.results[0].key}`
    return trailerLink;
  }
}

const listaDeFilmes = async () => {
  // carregando();
  const lista = await fetch(url);
  const listaJson = await lista.json();
  listaJson.results.forEach(async ({ title, vote_average, poster_path, overview, id}) => {
    const thumbnail = urlImg + poster_path;
    const title2 = title;
    const note = vote_average;
    const img = createImg('imgTest', thumbnail, overview)
    const div = createElement('div', 'filme', '', id)
    const h2 = createElement('h2', 'filmTitle', `${title2} ${note}`)
    const trailerBtn = createElement('a', 'btn-trailer', 'Ver Trailer')
    div.appendChild(img);
    div.appendChild(h2);
    div.appendChild(trailerBtn);
    getDiv.appendChild(div);
    const trailerLink = await getTrailerLink(id);
    if (trailerLink) trailerBtn.href = trailerLink;
  });
};
// faz a requisição da API e transforma em objeto Json

window.onload = async () => {
  listaDeFilmes();
  const trendingMovies = await getTrendingFilms()
  getBannerLinks(trendingMovies);
};
