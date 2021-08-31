// файл apiService.js с дефолтным экспортом объекта отвечающего за логику HTTP-запросов к API

import { BASE_URL, API_KEY } from './constants';

import axios from 'axios';
axios.defaults.baseURL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

// export default function fetchImage(search) {
//   return fetch(
//     `${BASE_URL}?image_type=photo&orientation=horizontal&q=${search}&page=1&per_page=12&key=${API_KEY}`
//   ).then(response => {
//     return response.json();
//   });
// }

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    // this.base_url = 'https://pixabay.com/api/';
    this.key = '22935349-f238c1b9d1a1a29229f76f105';
  }

  async fetchPictures() {
    const url = `&q=${this.query}&page=${this.page}&per_page=12&key=${this.key}`;
    // `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;

    const {
      data: { hits },
    } = await axios.get(url);
    return hits;

    // return fetch(url)
    //   .then(response => response.json())
    //   .then(data => data.hits);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    //   query - хранит сервис, котор отвечает за раб с API, а не внешний код
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
