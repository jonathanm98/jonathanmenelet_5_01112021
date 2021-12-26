/* J'initialise la variable article qui contiendra mon api */
let articles = [];

/* Je crée une fonction qui récupére tout les articles depuis mon API */
async function fetchApi() {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    // Je stock le tout dans une variable articles
    .then((data) => (articles = data));
}

/* Je crée une fonction avec une boucle pour afficher mes vignettes */
async function canapDisplay() {
  await fetchApi();
  let items = document.getElementById("items");
  for (let i = 0; i < articles.length; i++) {
    items.innerHTML += `
      <a href="./product.html?id=${articles[i]._id}">
        <article>
          <img src="${articles[i].imageUrl}" alt="${articles[i].altTxt}">
          <h3 class="productName">${articles[i].name}</h3>
          <p class="productDescription">${articles[i].description}</p>
        </article>
      </a>`;
  }
}
canapDisplay();
