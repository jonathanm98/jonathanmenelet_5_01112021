// on récupére l'id de notre produit depuis l'url pour cibler notre canapé dans l'API
let productId = window.location.search.replace("?id=", "");
let image = document.querySelector(".item__img");
let prix = document.getElementById("price");
let description = document.getElementById("description");
let colorSelector = document.getElementById("colors");
let quantitySelector = document.getElementById("quantity");
let validateInput = document.getElementById("addToCart");
let storage = JSON.parse(localStorage.getItem("panier"));
let product = [];
let cartUser = {
  name: "",
  price: "",
  id: "",
  color: "",
  quantity: "0",
  srcImg: "",
  altTxt: "",
};

/* Je récupére mon produit depuis mon API */
const fetchApiProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => (product = data));
};

// Je modifie les éléments de la page par rapport au produit séléctionné
const productPush = async () => {
  await fetchApiProduct();
  //Titre document
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
  //on stock les infos nom/prix/id dans l'objet cartUser
  cartUser.name = product.name;
  cartUser.price = product.price;
  cartUser.id = product._id;
  cartUser.srcImg = product.imageUrl;
  cartUser.altTxt = product.altTxt;
};
productPush();

// On envoie la couleur choisie de la liste déroulante dans l'objet cartUser
colorSelector.addEventListener("input", (e) => {
  cartUser.color = e.target.value;
});
// On recupere la quantité choisie dans l'objet cartUser
quantitySelector.addEventListener("input", (e) => {
  cartUser.quantity = parseInt(e.target.value);
});

// EventListener pour la soumition du formulaire
validateInput.addEventListener("click", () => {
  //Fonction qui sera appelé à chaque click et qui definiera que faire de notre obj cartUser
  function produitDoublon() {
    const getProduct = storage.find(
      (element) => element.id == cartUser.id && element.color == cartUser.color
    );
    if (cartUser.color == "") {
      alert("Veuillez choisir une coulaur valide");
    } else if (cartUser.quantity == 0 || cartUser.quantity == "") {
      alert("Veuillez choisir une quantité");
    } else if (getProduct) {
      for (article of storage) {
        if (article.id === cartUser.id) {
          article.quantity += cartUser.quantity;
        }
      }
      localStorage.setItem("panier", JSON.stringify(storage));
    } else {
      storage.push(cartUser);
      localStorage.setItem("panier", JSON.stringify(storage));
    }
  }
  produitDoublon();
  console.log(JSON.parse(localStorage.getItem("panier")));
});

//
/*validateInput.addEventListener("click", () => {
  let getCart = JSON.parse(localStorage.getItem("panier"));
  if (getCart) {
    const getProduct = getCart.find(
      (element) => element.id == cartUser.id && element.color == cartUser.color
    );

    if (getProduct) {
      getProduct.quantity += cartUser.quantity;

      localStorage.setItem("panier", JSON.stringify(getCart));
      return;
    }
    getCart.push(cartUser);
    localStorage.setItem("panier", JSON.stringify(getCart));
  } else {
    const cart = [];
    cart.push(cartUser);
    localStorage.setItem("panier", JSON.stringify(cart));
  }
});*/
