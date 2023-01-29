import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

function fetchCountries() {
  const name = inputField.value.trim();
  const fields = 'name,capital,population,flags,languages';
  if (!name) {
    clearCountryList();
    clearCountryInfo();
    return;
  }

  fetch(`https://restcountries.com/v3.1/name/${name}?fields=${fields}`)
    .then(handleResponse)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountryList();
        clearCountryInfo();
        return;
      }

      if (data.length > 2 && data.length < 10) {
        renderCountryList(data);
        return;
      }

      renderCountryInfo(data);
    })
    .catch(handleError);
}

function handleResponse(res) {
  if (!res.ok) {
    throw new Error(res.status);
  }
  return res.json();
}

function handleError(error) {
  if (error.message === '404') {
    clearCountryList();
    clearCountryInfo();
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else {
    console.error(error);
  }
}

function renderCountryList(data) {
  const countryListItems = data.map(({ name, flags }) => {
    return `<li>
<img src="${flags.svg}" alt="${name.official} flag" />
<p> ${name.official}</p>
</li>`;
  });
  countryList.innerHTML = countryListItems.join('');
  clearCountryInfo();
}

function renderCountryInfo(data) {
  const countryInfoItems = data.map(
    ({ name, capital, population, flags, languages }) => {
      return `<div class = "wrapper"><img src="${flags.svg}" alt="${
        name.official
      } flag" />
                <p>${name.official}</p></div>
                <p><b>Capital:</b> ${capital}</p>
                <p><b>Population:</b> ${population}</p>
                <p><b>Languages:</b> ${Object.values(languages).join(', ')}
                </p>`;
    }
  );
  countryInfo.innerHTML = countryInfoItems.join('');
  clearCountryList();
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}
