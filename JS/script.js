const url = 'https://api.themoviedb.org/3/movie/400?api_key=ca19804bba1e445e3db2ec8fbecda738';
const urlImg = 'https://www.themoviedb.org/t/p/w220_and_h330_face';

const getIMG = document.getElementById('imgtest');
const getTitle = document.getElementById('titleTest')

const listaDeFilmes =  async () => {
  const lista = await fetch(url);
  const listaJson = await lista.json();
  console.log(listaJson);
  const thumbnail = urlImg+listaJson.poster_path;
  const title = listaJson.original_title;
  const note = listaJson.vote_average;
  getIMG.src = thumbnail;
  getTitle.innerText = `${title} ${note}`;
};

window.onload = () => {
  listaDeFilmes();
};
