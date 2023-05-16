const API_URL = 'https://api.tvmaze.com/search/shows?';
const $ = document.getElementById.bind(document);

window.addEventListener('load', () => {
  const searchResults = JSON.parse(localStorage.getItem('searchResults'));
  if (searchResults && searchResults.length > 0) {
    renderSearchResults(searchResults);
  }
});

$('favorites-button').addEventListener('click', function() {
  window.location.href = 'favorites.html';
});

const searchShows = (event) => {
  event.preventDefault();

  const query = $('query').value;
  clearSearchResults();

  if (query.trim()) {
    $('not-found-message').style.display = 'none';

    const loadingAnimation = `
      <img src="/img/loading.gif" alt="Procurando...">
    `;
    $('shows-area').innerHTML = loadingAnimation;

    fetch(API_URL + new URLSearchParams({ q: query }))
      .then((response) => response.json())
      .then((results) => {
        $('shows-area').innerHTML = '';

        if (results.length === 0) {
          console.log('Nenhum resultado');
          $('not-found-message').style.display = 'block';
          return;
        }

        renderSearchResults(results);
        saveSearchResults(results);
      })
      .catch((error) => {
        console.log('Erro na busca:', error);
        $('shows-area').innerHTML = '';
      });
  }
};

const renderSearchResults = (results) => {
  results.forEach((r) => {
    const { show } = r;
    const { id, name, image } = show;

    const imageUrl = image ? image.medium : '/img/noimage.png';

    const newShow = {
      id,
      name,
      imageUrl,
    };

    printCard(newShow);
  });
};

const printCard = (show) => {
  const posterId = `poster-${show.id}`;
  const titleId = `title-${show.id}`;

  const showCard = `
    <div class="show-card">
      <a href="/details.html?id=${show.id}">
        <img id="${posterId}" src="${show.imageUrl}" alt="${show.name}">
      </a>

      <a href="/details.html?id=${show.id}">
        <h3 id="${titleId}">${show.name}</h3>
      </a>
    </div>
  `;

  const showsArea = $('shows-area');
  showsArea.insertAdjacentHTML('beforeend', showCard);
};

const saveSearchResults = (results) => {
  localStorage.setItem('searchResults', JSON.stringify(results));
};

const clearSearchResults = () => {
  localStorage.removeItem('searchResults');
};

const form = $('form-area');
form.addEventListener('submit', searchShows);

