const getFocus = document.querySelectorAll('.imgFocus');

function choosePerfil(e) {
  localStorage.setItem('perfil', e.target.src)
  localStorage.setItem(`key${e.id}`, e.id);
}

getFocus.forEach((element) => element.addEventListener('click', choosePerfil));
