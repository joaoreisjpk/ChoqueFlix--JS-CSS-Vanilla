const url = 'https://api.themoviedb.org/3/movie/400?api_key=ca19804bba1e445e3db2ec8fbecda738';
const urlImg = 'https://www.themoviedb.org/t/p/w220_and_h330_face';

const getIMG = document.getElementById('imgtest');
const getTitle = document.getElementById('titleTest')

const carregando = async () => {
  const section = document.createElement('section');
  section.innerHTML = 'Loading...';
  section.className = 'loading';
  document.querySelector('#test').appendChild(section);
};
// adiciona uma frase 'loading' enquanto se faz a requisição da API

const listaDeFilmes =  async () => {
  carregando();
  const lista = await fetch(url);
  const listaJson = await lista.json();
  document.querySelector('.loading').remove();
  console.log(listaJson);
  const thumbnail = urlImg+listaJson.poster_path;
  const title = listaJson.original_title;
  const note = listaJson.vote_average;
  getIMG.src = thumbnail;
  getTitle.innerText = `${title} ${note}`;
};
// faz a requisição da API e transforma em objeto Json

window.onload = () => {
  listaDeFilmes();
};