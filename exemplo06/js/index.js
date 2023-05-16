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

  if (query.trim()) {
    $('not-found-message').style.display = 'none';

    const loadingAnimation = `
      <img src="/img/loading.gif" alt="Procurando...">
    `;
    $('shows-area').innerHTML = loadingAnimation;

    fetch(API_URL + new URLSearchParams({ q: query }))
      .then((response) => response.json())
      .then((results) => {
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

const updateFavoriteIcon = (id) => {
  const favoriteIcon = $(`favorite-icon-${id}`);
  const isFavorite = checkIfFavorite(id);
  if (isFavorite) {
    favoriteIcon.classList.add('fas');
  } else {
    favoriteIcon.classList.remove('fas');
  }
};

const favFavorite = (id) => {
  const favoriteIcon = $(`favorite-icon-${id}`);
  favoriteIcon.classList.toggle('fas');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  updateFavoriteIcon(id); // Atualiza o ícone de favorito/desfavorito
};

const checkIfFavorite = (id) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(id);
};

const renderSearchResults = (results) => {
  clearSearchResults();

  results.forEach((r) => {
    const { show } = r;
    const { id, name, image } = show;

    const imageUrl = image ? image.medium : '/img/noimage.png';

    const newShow = {
      id,
      name,
      imageUrl,
    };

    if (!isShowAlreadyRendered(newShow.id)) {
      printCard(newShow);
    }
  });

  attachFavoriteListeners();
};

const printCard = (show) => {
  const posterId = `poster-${show.id}`;
  const titleId = `title-${show.id}`;
  const favoriteIconId = `favorite-icon-${show.id}`;

  const showCard = `
    <div class="show-card">
      <a href="/details.html?id=${show.id}">
        <img id="${posterId}" src="${show.imageUrl}" alt="${show.name}">
      </a>

      <a href="/details.html?id=${show.id}">
        <h3 id="${titleId}">${show.name}</h3>
      </a>

      <i id="${favoriteIconId}" class="far fa-star"></i>
    </div>
  `;

  const showsArea = $('shows-area');
  showsArea.insertAdjacentHTML('beforeend', showCard);

  checkIfFavoriteAndSetIcon(show.id); // Adicionado para verificar se o programa é favorito ou não
};

const attachFavoriteListeners = () => {
  const showCards = document.querySelectorAll('.show-card');
  showCards.forEach((card) => {
    const favoriteIcon = card.querySelector('i');
    const showId = card.querySelector('img').id.replace('poster-', '');

    updateFavoriteIcon(showId); // Atualiza o ícone de favorito/desfavorito

    favoriteIcon.addEventListener('click', () => {
      favFavorite(showId);
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  attachFavoriteListeners();
});

const saveSearchResults = (results) => {
localStorage.setItem('searchResults', JSON.stringify(results));
};

const clearSearchResults = () => {
const showsArea = $('shows-area');
showsArea.innerHTML = '';
};

const isShowAlreadyRendered = (showId) => {
const existingCards = document.querySelectorAll('.show-card');
for (let i = 0; i < existingCards.length; i++) {
const card = existingCards[i];
const cardId = card.querySelector('img').id.replace('poster-', '');
if (cardId === showId) {
return true;
}
}
return false;
};

const checkIfFavoriteAndSetIcon = (showId) => {
  const favoriteIcon = $(`favorite-icon-${showId}`);
const isFavorite = checkIfFavorite(showId);
if (isFavorite) {
favoriteIcon.classList.add('fas');
} else {
favoriteIcon.classList.remove('fas');
}
};

const form = $('form-area');
form.addEventListener('submit', searchShows);