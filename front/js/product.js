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

if (storage == null) {
  storage = [];
}

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
quantitySelector.addEventListener("change", (e) => {
  cartUser.quantity = parseInt(e.target.value);
});

// ----------------NOUVELLE VALIDATION FORM-------------
validateInput.addEventListener("click", () => {
  // Fonction qui envoie notre objet au localStorage
  function setToLocalStorage() {
    // SI un des objet de mon storage à le même id et la même color que mon objet cartUser ...
    if (
      storage.find(
        (item) => item.id == cartUser.id && item.color == cartUser.color
      )
    ) {
      // ... on execute la boucle suivante
      // POUR chaque article dans notre panier ...
      for (article of storage) {
        // ... SI cet objet est l'objet qui à le même id et la même color ...
        if (article.id == cartUser.id && article.color == cartUser.color) {
          // ... on effectue une affectation après addition
          article.quantity += cartUser.quantity;
        }
      }
    }
    // SINON on crée un objet dans le storage avec notre cartUser
    else {
      storage.push(cartUser);
    }
    // On met à jour le localStorage avec notre storage[...]
    localStorage.setItem("panier", JSON.stringify(storage));
  }

  // Fonction qui vérifie que les champ quantité et couleur sont bien renseigné
  function verifyInvalidInput() {
    if (cartUser.color == "") {
      // on averti l'utilisateur que le champ doit être renseigné
      alert("Veuillez choisir une couleur valide");
    } else if (cartUser.quantity == 0 || cartUser.quantity == "") {
      //       //on averti l'utilisateur que le champ doit être renseigné
      alert("Veuillez choisir une quantité");
    } else {
      setToLocalStorage();
    }
  }
  verifyInvalidInput();
});
