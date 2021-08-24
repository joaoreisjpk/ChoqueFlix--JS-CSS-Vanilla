const url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=ca19804bba1e445e3db2ec8fbecda738';
const urlImg = 'https://www.themoviedb.org/t/p/w220_and_h330_face';

const getDiv = document.getElementById('film-list')
const getIMG = document.getElementById('imgtest');
const getTitle = document.getElementById('titleTest');

function createElement(element, className, content) {
  const el = document.createElement(element);
  el.className = className;
  el.innerText = content;
  return el;
};

function createImg(className, source, alt) {
  const img = document.createElement('img');
  img.className = className;
  img.src = source;
  img.alt = alt;
  return img;
};

const carregando = async () => {
  const section = document.createElement('section');
  section.innerHTML = 'Loading...';
  section.className = 'loading';
  document.querySelector('#film-list').appendChild(section);
};
// adiciona uma frase 'loading' enquanto se faz a requisição da API

const listaDeFilmes =  async () => {
  carregando();
  const lista = await fetch(url);
  const listaJson = await lista.json();
  listaJson.results.forEach(({ title, vote_average, poster_path, overview}) => {
    const thumbnail = urlImg + poster_path;
    const title2 = title;
    const note = vote_average;
    const img = createImg('imgTest', thumbnail, overview)
    const div = createElement('div', 'filme', '')
    const h2 = createElement('h2', 'filmTitle', `${title2} ${note}`)
    div.appendChild(img);
    div.appendChild(h2);
    getDiv.appendChild(div);
  });

};
// faz a requisição da API e transforma em objeto Json


window.onload = () => {
  listaDeFilmes();
};
