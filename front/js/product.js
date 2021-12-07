// on récupére l'id de l'url pour cibler notre canapé dans l'API
let productId = window.location.search.replace("?id=", "");
let image = document.querySelector(".item__img");
let prix = document.getElementById("price");
let description = document.getElementById("description");
let product = [];
let cartUser = {};

/* Je récupére mon produit depuis mon API */
const fetchApiProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => (product = data));
};

// Je modifie les éléments de la page par rapport au produit séléctionné
const productPush = async () => {
  await fetchApiProduct();
  //Titre header
  document.title = product.name;

  //Image section
  image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;

  //Prix
  prix.innerHTML = product.price;

  //Description
  description.innerHTML = product.description;

  //Boucle pour la liste déroulante du choix de couleurs
  for (let i = 0; i < product.colors.length; i++) {
    selectorColor = document.getElementById("colors");
    selectorColor.innerHTML += `
    <option value="${product.colors[i]}">${product.colors[i]}</option>`;
  }
  console.log(product);
  //on stock les infos nom/prix dans l'objet cartUser
  cartUser.name = product.name;
  cartUser.price = product.price;
  cartUser.id = product._id;
};
productPush();

// Stockage des choix de l'utilisateur

colorSelector = document.getElementById("colors");
quantitySelector = document.getElementById("quantity");
validateInput = document.getElementById("addToCart");
color = "";
quantity = "";

colorSelector.addEventListener("input", (e) => {
  color = e.target.value;
  cartUser.color = color;
});
quantitySelector.addEventListener("input", (e) => {
  quantity = e.target.value;
  cartUser.quantity = quantity;
});
validateInput.addEventListener("click", () => {
  for (i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) == cartUser.id + cartUser.color) {
      let cartItem = JSON.parse(localStorage.getItem(localStorage.key(i)));
      cartUser.quantity += parseInt(cartItem.quantity);
      break;
    }
  }
  localStorage.setItem(cartUser.id + cartUser.color, JSON.stringify(cartUser));
});
