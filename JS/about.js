import { createElement, getFilmList, removeBanner } from './main.js';

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
let index = 1;
const text = 'Em Breve . . .';

function about() {
  getFilmList.innerHTML = '';
  const comming = document.createElement('p');
  comming.id = 'waiting';
  document.querySelector('#page-title').innerHTML = '';
  document.querySelector('#page-title').appendChild(comming);
  devsInfos.forEach((dev) => {
    getFilmList
    .appendChild(createElement('div', 'devs-div', movieCredits(dev.img, dev.git, dev.linked)));
  });
  getFilmList.querySelectorAll('div').forEach((div) => div.style.margin = 'auto');
  intervalId = setInterval(() => {
    comming.innerText = text.slice(0, index);
    index += 1;
    if (index === 16) {
      setTimeout(() => {
        comming.innerText = '|';
        index = 1;
      }, 1000);
    }
  }, 200);
  removeBanner();
  document.querySelector('#page-list').style = 'visibility: hidden';
}

export { about, intervalId };