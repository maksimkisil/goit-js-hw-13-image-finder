import ImagesApiService from './apiService';
import LoadMoreBtn from './load-more-btn';

// handlebars
import imageCardTpl from '../templates/image-card.hbs';

// pnotify
import { defaultModules, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import '@pnotify/core/dist/BrightTheme.css'; //color theme for error

defaultModules.set(PNotifyMobile, {});

// basicLightbox
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';

// refs
const formInputRef = document.getElementById('search-form');
const galleryListRef = document.getElementById('gallery-list');
const loadMoreBtnRef = document.getElementById('my-element-selector');

// instances
const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

// IntersectionObserver
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};
const observer = new IntersectionObserver(onLoadMoreClick, options);

function setError(data) {
  const now = new Date().valueOf();
  let endPoint = 0;

  if (now > endPoint) {
    endPoint = now + data.delay + 1000;
    return error(data);
  }
}

async function onSearch(e) {
  e.preventDefault();
  clearImagesContainer();

  const value = e.target.elements.query.value.trim();
  if (value === '') {
    return setError({
      title: `Please enter some value!`,
      delay: 500,
    });
  }
  imagesApiService.query = value;
  const data = await imagesApiService.fetchPictures();
  renderImagesMarkup(data);

  // if () {
  // Кнопку не показывать когда картинки закончились
  loadMoreBtn.show();
  // }

  fetchImages();
  imagesApiService.resetPage();
}
formInputRef.addEventListener('submit', onSearch);

function fetchImages() {
  loadMoreBtn.disable();
  imagesApiService.fetchPictures().then(hits => {
    // renderImagesMarkup(hits);
    loadMoreBtn.enable();
    formInputRef.reset();

    //   не должно скролиться к кнопке лоад мор при первой загрузки картинок. потом скролить нужно каждый раз при клике на лоад мор к кнопке
  });
}

function renderImagesMarkup(hits) {
  galleryListRef.insertAdjacentHTML('beforeend', imageCardTpl(hits));

  // const markup = hits.reduce((acc, item) => {
  //   const el = `<li class='gallery-item'>
  //   <div class='photo-card'>

  //     <div class='gallery-image-box'>
  //       <img class='gallery-image' src='${item.webformatURL}' alt='${item.tags}' />
  //     </div>

  //     <div class='stats'>

  //       <p class='stats-item'>
  //         <i class='material-icons'>thumb_up</i>
  //         ${item.likes}
  //       </p>

  //       <p class='stats-item'>
  //         <i class='material-icons'>visibility</i>
  //         ${item.views}
  //       </p>

  //       <p class='stats-item'>
  //         <i class='material-icons'>comment</i>
  //         ${item.comments}
  //       </p>

  //       <p class='stats-item'>
  //         <i class='material-icons'>cloud_download</i>
  //         ${item.downloads}
  //       </p>

  //     </div>
  //   </div>
  // </li>`;

  //   return `${acc} ${el}`;
  // }, '');

  // galleryListRef.insertAdjacentHTML('beforeend', markup);
}

function clearImagesContainer() {
  galleryListRef.innerHTML = '';
}

async function onLoadMoreClick(e) {
  observer.observe(loadMoreBtnRef);
  imagesApiService.incrementPage();

  const data = await imagesApiService.fetchPictures();
  renderImagesMarkup(data);

  galleryListRef.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}
// loadMoreBtn.refs.button.addEventListener('click', onLoadMoreClick);
loadMoreBtnRef.addEventListener('click', onLoadMoreClick);

function showModal(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  const instance = basicLightbox.create(`
        <img class="gallery-image" src="${e.target.dataset.source}" width="800" height="600">
    `);
  instance.show();
}
galleryListRef.addEventListener('click', showModal);

// --------------------------------------------------------------------------------
// async function fn () {}

// const fn  = async function () {}

// const arr = async () => {}

// const x = {
//   async getname () {}
// }

// class X {
//   async getName () {}
// }
// --------------------------------------------------------------------------------
