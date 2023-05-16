const API_URL = 'https://api.tvmaze.com/shows'

const $ = document.getElementById.bind(document)
const favorites = JSON.parse(localStorage.getItem('favorites'));

const printCard = (show) => {
  const posterId = `poster-${show.id}`
  const titleId = `title-${show.id}`

  const showCard = `
        <div class="show-card">
          <a href="/details.html?id=${show.id}">
            <img id="${posterId}" src="${show.imageUrl}" alt="${show.name}">
          </a>

          <a href="/details.html?id=${show.id}">
            <h3 id="${titleId}">${show.name}</h3>
          </a>
        </div>
    `

  const showsArea = $('favorites-list')
  showsArea.insertAdjacentHTML('beforeend', showCard)
}

var favoritesList = document.getElementById('favorites-list');

favorites.forEach(function(itemId) {
  fetch(`${API_URL}/${itemId}`).then(response => {
    response.json().then(result => {

      const { id, name, image } = result

      const imageUrl = image ? image.medium : '/img/noimage.png'

      const newShow = {
        id,
        name,
        imageUrl
      }

      printCard(newShow)
    })
  })

    var itemElement = document.querySelector('[data-id="' + itemId + '"]');
    if (itemElement) {
        favoritesList.appendChild(itemElement.cloneNode(true));
    }
});

const backButton = $('back-button');
backButton.addEventListener('click', () =>{
    window.location.href = 'index.html';
})

