// on récupére l'id de notre produit depuis l'url pour cibler notre canapé dans l'API
let productId = window.location.search.replace("?id=", "");
let image = document.querySelector(".item__img");
let prix = document.getElementById("price");
let description = document.getElementById("description");
let colorSelector = document.getElementById("colors");
let quantitySelector = document.getElementById("quantity");
let validateInput = document.getElementById("addToCart");

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
const productAddInfos = async () => {
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
productAddInfos();

// On envoie la couleur choisie de la liste déroulante dans l'objet cartUser
colorSelector.addEventListener("input", (e) => {
  cartUser.color = e.target.value;
});
// On recupere la quantité choisie dans l'objet cartUser
quantitySelector.addEventListener("change", (e) => {
  cartUser.quantity = parseInt(e.target.value);
});

// ----------------NOUVELLE VALIDATION FORM-------------
validateInput.addEventListener("click", () => {
  // Fonction qui vérifie que les champ quantité et couleur sont bien renseigné
  function verifyInvalidInput() {
    if (cartUser.color == "") {
      // on averti l'utilisateur que le champ doit être renseigné
      alert("Veuillez choisir une couleur valide");
    } else if (cartUser.quantity == 0 || cartUser.quantity == "") {
      //on averti l'utilisateur que le champ doit être renseigné
      alert("Veuillez choisir une quantité");
    } else {
      setToLocalStorage();
    }
  }
  // Fonction qui envoie notre objet au localStorage
  function setToLocalStorage() {
    let storage = JSON.parse(localStorage.getItem("panier"));

    // SI notre panier n'est pas vide
    if (storage) {
      // On cherche l'article avec le même id et la même color que notre obj cartUser ...
      let getProduct = storage.find(
        (element) =>
          element.id == cartUser.id && element.color == cartUser.color
      );
      // ... et on met à jour sa quantité
      if (getProduct) {
        getProduct.quantity += cartUser.quantity;
        // On envoie le nouveau panier dans le localStorage
        localStorage.setItem("panier", JSON.stringify(storage));
        alert("Votre quantité à bien été mise a jour");

        return;
      }
      // On crée un nouveau objet dans le panier si la couleur est différente
      storage.push(cartUser);
      localStorage.setItem("panier", JSON.stringify(storage));
      alert("Votre produit à bien été ajouté au panier");
    }
    // SINON le panier est vide on crée le premier objet
    else {
      const cart = [];
      cart.push(cartUser);
      localStorage.setItem("panier", JSON.stringify(cart));
      alert("Votre produit à bien été ajouté au panier");
    }
  }
  verifyInvalidInput();
});
