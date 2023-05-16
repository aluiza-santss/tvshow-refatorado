const $ = document.getElementById.bind(document);

const API_URL = 'https://api.tvmaze.com/shows';

const search = window.location.search;
const params = new URLSearchParams(search);
const id = params.get('id');
console.log(id);

// Restaurar o estado inicial da estrela ao carregar a página
window.addEventListener('DOMContentLoaded', function () {
  var favoriteIcon = document.getElementById('favorite-icon');
  var favorite = JSON.parse(localStorage.getItem('favorites')) || [];
  var index = favorite.indexOf(id);
  if (index !== -1) {
    favoriteIcon.classList.add('fas');
  } else {
    favoriteIcon.classList.remove('fas');
  }
});

fetch(`${API_URL}/${id}`).then((response) => {
  response.json().then((result) => {
    const { name, type, language, genres, status, image, network, webChannel } =
      result;

    const running = status === 'Ended' ? false : true;
    const imageUrl = image ? image.medium : '/img/noimage.png';
    const channel = network ? network.name : webChannel.name;

    $('poster').src = imageUrl;
    $('name').innerText = name;
    $('type').innerText = type;
    $('language').innerText = language;
    $('genres').innerText = genres.join(', ');
    $('running').innerText = running ? 'Sim' : 'Não';
    $('channel').innerText = channel;
  });
});

var favoriteIcon = document.getElementById('favorite-icon');
var itemId = 1; // Identificador único do item (deve corresponder ao data-id no HTML)

// Evento de clique para alternar o estado do favorito
favoriteIcon.addEventListener('click', function () {
  favoriteIcon.classList.toggle('fas');
  var favorite = JSON.parse(localStorage.getItem('favorites')) || [];

  var index = favorite.indexOf(id);
  if (index === -1) {
    favorite.push(id);
  } else {
    favorite.splice(index, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorite));
});