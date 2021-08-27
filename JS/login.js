const getFocus = document.querySelectorAll('.imgFocus');
const perfilImg = (url => url);

function removeActive(e) {
  getFocus.forEach(
    (element) => element.classList.remove('imgActive')
  );
  e.target.classList.add('imgActive'); localStorage.setItem('perfil', e.target.src)
  perfilImg(e.target.src); console.log(perfilImg(e.target.src));
}

getFocus.forEach((element) => element.addEventListener('click', removeActive));

export { perfilImg };