import './css/styles.css';
import notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './jsParts/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
  searchBox: document.querySelector('#search-box'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchName = refs.searchBox.value.trim();
  if (searchName === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(searchName)
    .then(countries => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      if (countries.length > 10) {
        notiflix.Notify.info(
          'Doprecyzuj nazwę kraju'
        );
        return;
      }

      if (countries.length > 1 && countries.length <= 10) {
        refs.countryList.innerHTML = createCountryList(countries);
        refs.countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        refs.countryInfo.innerHTML = createCountryInfo(countries);
      }
    })
    .catch(error => {
      notiflix.Notify.failure('nie ma Państwa o takiej nazwie');
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      return error;
    });
}

function createCountryInfo(countries) {
  const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
    <img src="${flags.svg}" alt="flag" width="40px">
    <h1 class="country-name">${name.official}</h1>
    <p class="country-text"><b>Capital:</b> ${capital}</p>
    <p class="country-text"><b>Population:</b> ${population}</p>
    <p class="country-text"><b>Languages:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  return markup;
}

function createCountryList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
     <li>
    <img src="${flags.svg}" alt="flag" width="30px">
    <h2 class="country-name">${name.official}</h2>
    </li>
 `;
    })
    .join('');
  return markup;
}