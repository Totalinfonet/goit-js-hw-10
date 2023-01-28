// import debounce from 'lodash.debounce';
// import Notiflix from 'notiflix';
// import './css/styles.css';

// const DEBOUNCE_DELAY = 300;

// const inputField = document.querySelector('#search-box');
// const countryList = document.querySelector('.country-list');
// const countryInfo = document.querySelector('.country-info');

// inputField.addEventListener('input', debounce(fetchCountries, DEBOUNCE_DELAY));

// function fetchCountries() {
//   const name = inputField.value.trim();
//   const fields = 'name,capital,population,flags,languages';
//   if (!name) {
//     countryList.innerHTML = '';
//     countryInfo.innerHTML = '';
//     return;
//   }

//   fetch(`https://restcountries.com/v3.1/name/${name}?fields=${fields}`)
//     .then(res => {
//       if (!res.ok) {
//         throw new Error(res.status);
//       }
//       return res.json();
//     })
//     .then(data => {
//       if (data.length > 10) {
//         Notiflix.Notify.info(
//           'Too many matches found. Please enter a more specific name.'
//         );
//         countryInfo.innerHTML = '';
//         return;
//       }

//       if (data.length > 2 && data.length < 10) {
//         const countryListItems = data.map(country => {
//           return `<li>
// <img src="${country.flags.svg}" alt="${country.name.official} flag" width="50" />
// <p>Name: ${country.name.official}</p>
// </li>`;
//         });
//         countryList.innerHTML = countryListItems.join('');
//         countryInfo.innerHTML = '';
//         return;
//       }

//       const countryInfoItems = data.map(country => {
//         return `<img src="${country.flags.svg}" alt="${
//           country.name.official
//         } flag" width="50" />

//                     <p>Name: ${country.name.official}</p>
//                     <p>Capital: ${country.capital}</p>
//                     <p>Population: ${country.population}</p>
//                     <p>Languages: ${Object.values(country.languages)}</p>`;
//       });

//       countryInfo.innerHTML = countryInfoItems.join('');
//       countryList.innerHTML = '';
//     })
//     .catch(error => {
//       if (error.message === '404') {
//         Notiflix.Notify.failure('Oops, there is no country with that name');
//       } else {
//         console.error(error);
//       }
//     });
// }
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
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetch(`https://restcountries.com/v3.1/name/${name}?fields=${fields}`)
    .then(handleResponse)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
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
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else {
    console.error(error);
  }
}

function renderCountryList(data) {
  const countryListItems = data.map(country => {
    return `<li>
<img src="${country.flags.svg}" alt="${country.name.official} flag" width="50" />
<p>Name: ${country.name.official}</p>
</li>`;
  });
  countryList.innerHTML = countryListItems.join('');
  countryInfo.innerHTML = '';
}

function renderCountryInfo(data) {
  const countryInfoItems = data.map(country => {
    return `<img src="${country.flags.svg}" alt="${
      country.name.official
    } flag" width="50" />
                <p>Name: ${country.name.official}</p>
                <p>Capital: ${country.capital}</p>
                <p>Population: ${country.population}</p>
                <p>Languages: ${Object.values(country.languages)}</p>`;
  });

  countryInfo.innerHTML = countryInfoItems.join('');
  countryList.innerHTML = '';
}
