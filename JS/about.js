import { createElement, getFilmList, removeBanner } from './main.js';
import { credits, trybeAd } from './credits.js';

const movieCredits = (img, gitHub, linkedIn) =>
`<img src="${img}">
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
  { img: imgTakaki, git: gitTakaki, linked: linkedTakaki },
  { img: imgJoao, git: gitJoao, linked: linkedJoao },
  { img: imgNatan, git: gitNatan, linked: linkedNatan },
  { img: imgGus, git: gitGus, linked: linkedGus }
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
    if (indexCounter > 11) document.querySelector('#page-title').innerHTML = '';
  }, 12000);
}

function editFilmList(condition) {
  if (!condition) {
    getFilmList.style =
      `overflow-Y: hidden;
    height: 500px;
    top: -50px;`
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
  removeBanner();
  document.querySelector('#page-list').style = 'visibility: hidden';
  getFilmList.innerHTML = '';
  beforeAbout();
  const creditsDiv = createElement('div', 'credits', credits);
  creditsDiv.style.marginTop = '45%';
  getFilmList.appendChild(creditsDiv);
  editFilmList();
  intervalId = setInterval(() => {
    const margin = creditsDiv.style.marginTop.match(/\d+(\.\d)?/g)[0];
    index < 45 ?
    creditsDiv.style.marginTop = `${+(margin) - 1.05}%` :
    creditsDiv.style.marginTop = `${-(margin) + -1.05}%`;
    index += 1;
    console.log(creditsDiv.style.marginTop, index);
    if (index > 173) {
      clearInterval(intervalId);
      creditsDiv.remove();
      editFilmList(true);
      devsInfos.forEach((dev) => {
        getFilmList
          .appendChild(createElement('div', 'devs-div', movieCredits(dev.img, dev.git, dev.linked)));
      });
      setTimeout(() => {
        document.querySelectorAll('.devs-div').forEach((div) => div.style.transform = 'scale(1)');
      }, 100);
    }
  }, 500)
  const jumpAd = document.querySelector('#jump-ad');
  jumpAd.addEventListener('click', () => {
    document.querySelector('#page-title div').remove();
    creditsDiv.style.marginTop = '12.05%';
    index = 30;
    console.log(creditsDiv.style.marginTop,'Clicou');
  });
}

export { about, intervalId, editFilmList };