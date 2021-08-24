const listaDeFilmes =  async () => {
  const lista = await fetch('https://api.themoviedb.org/3/movie/550?api_key=ca19804bba1e445e3db2ec8fbecda738');
  const listaJson = await lista.json();
  console.log(listaJson);
};

window.onload = () => {
  listaDeFilmes();
};
