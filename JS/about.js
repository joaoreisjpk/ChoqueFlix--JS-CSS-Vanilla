import { createElement, getFilmList, removeBanner } from './main.js';
import { credits, trybeAd } from './credits.js';

const movieCredits = (img, nome, gitHub, linkedIn) =>
`<img src="${img}">
<p class="sobre--name"> ${nome} </p>
<div class="btnsDiv">
  <a target='_blank' class='github' href="${gitHub}"><i class="github big icon"></i></a>
  <a target='_blank' class='linkedin' href="${linkedIn}"><i class="linkedin big icon"></i></a>
</div>`

const imgTakaki = 'https://github.com/regariou/trybeBonusProject/blob/main/images/takaki.jpeg?raw=true';
const imgJoao = 'https://github.com/regariou/trybeBonusProject/blob/main/images/joaoperfil.jpeg?raw=true';
const imgNatan = 'https://github.com/regariou/trybeBonusProject/blob/main/images/natanielperfil.jpeg?raw=true';
const imgGus = 'https://github.com/regariou/trybeBonusProject/blob/main/images/gusperfil.jpeg?raw=true';

const gitTakaki = 'https://github.com/Gabriel-takaki';
const gitJoao = 'https://github.com/regariou';
const gitNatan = 'https://github.com/natanielsantos159';
const gitGus = 'https://github.com/Warywise';

const linkedTakaki = 'https://www.linkedin.com/in/gabriel-felipe-takaki-99987b214/';
const linkedJoao = 'https://www.linkedin.com/in/joaoreisjpk/';
const linkedNatan = 'https://www.linkedin.com/in/nataniel-santos/';
const linkedGus = 'https://www.linkedin.com/in/g-s-s/';

const devsInfos = [
  { img: imgTakaki, nome: 'Gabriel Takaki', git: gitTakaki, linked: linkedTakaki },
  { img: imgJoao, nome: 'João Pedro Reis', git: gitJoao, linked: linkedJoao },
  { img: imgNatan, nome: 'Nataniel Santos', git: gitNatan, linked: linkedNatan },
  { img: imgGus, nome: "Gustavo Sant'Anna", git: gitGus, linked: linkedGus }
];

let intervalId;
let index = 0;
let indexCounter = 0;

function beforeAbout() {
  const pageTitle = document.querySelector('#page-title');
  pageTitle.innerHTML = trybeAd;
  const timer = document.querySelector('#trybeAdTime');
  indexCounter = 0;
  const countDown = () => {
    if (timer.innerHTML > 0) {
      timer.innerHTML = +(timer.innerHTML) - 1;
      indexCounter += 1;
      setTimeout(countDown, 1000);
    }
  }
  if (countDown) clearTimeout(countDown);
  countDown();
  setTimeout(() => {
    if (indexCounter > 4) {
      document.querySelector('#page-title').innerHTML = '';
      document.querySelector('.credits').style.opacity = '1';
    }
  }, 5000);
}

function editFilmList(condition) {
  if (!condition) {
    getFilmList.style =
      `overflow-Y: hidden;
    height: ${window.innerHeight}px;
    top: -80px;`
  } else {
    getFilmList.style =
    `overflow-Y: none;
  height: none;
  top: none;`
  }
}

function about() {
  if (intervalId) {
    clearInterval(intervalId);
    index = 0;
  }
  let changeNum;
  let limitNum;
  const refNum = window.innerWidth;
  if (refNum < 1001) {
    changeNum = refNum < 601 ? 1.5 : 1.3;
    limitNum = refNum < 601 ? 185 : 173;
  } else {
    changeNum = 1.2;
    limitNum = 130;
  }
  removeBanner();
  document.querySelector('#page-list').style = 'visibility: hidden';
  getFilmList.innerHTML = '';
  beforeAbout();
  const creditsDiv = createElement('div', 'credits', credits);
  getFilmList.appendChild(creditsDiv);
  editFilmList();
  creditsDiv.style.marginTop = '45%';
  intervalId = setInterval(() => {
    const margin = creditsDiv.style.marginTop.match(/\d+(\.\d+)?/g)[0];
    index < 40 ?
    creditsDiv.style.marginTop = `${+(margin) - changeNum}%` :
    creditsDiv.style.marginTop = `${-(margin) + -changeNum}%`;
    index += 1;
    console.log(creditsDiv.style.marginTop, index);
    if (index > limitNum) {
      clearInterval(intervalId);
      creditsDiv.remove();
      editFilmList(true);
      devsInfos.forEach((dev) => {
        getFilmList
          .appendChild(createElement('div', 'devs-div', movieCredits(dev.img, dev.nome, dev.git, dev.linked)));
      });
      setTimeout(() => {
        document.querySelectorAll('.devs-div').forEach((div) => div.style.transform = 'scale(1)');
      }, 100);
    }
  }, 500)
  document.querySelector('#jump-ad button')
    .addEventListener('click', () => {
    document.querySelector('#page-title div').remove();
    creditsDiv.style.marginTop = '10.5%';
    index = 31;
    document.querySelector('.credits').style.opacity = '1';
  });
}

export { about, intervalId, editFilmList };
