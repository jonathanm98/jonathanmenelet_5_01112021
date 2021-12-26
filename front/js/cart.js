let panier = JSON.parse(localStorage.getItem("panier"));
let vignettes = document.getElementsByClassName("cart__item");
let qty = 0;
let total = 0;
contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: "",
};
products = [];
orderId = undefined;
inputError = 0;
//
//------Affichage des vignettes pour chaque élément du panier
//
// SI le panier est vide on affiche "Vous n'avez aucun article dans votre panier !" à la place
if (panier == null) {
  document.getElementById(
    "cart__items"
  ).innerHTML = `<h3 style="text-align: center; margin-bottom: 50px;">Vous n'avez aucun article dans votre panier !</h3>`;
}
// SINON SI nous nous trouvons dans la page panier on execute notre code
else if (location.href.search("confirmation") < 0) {
  for (let article of panier) {
    qty += article.quantity;
    total += article.quantity * article.price;
    let html = `
  <article class="cart__item" data-id="${article.id}" id="${article.id}${article.color}" data-color="${article.color}">
                <div class="cart__item__img">
                  <img src="${article.srcImg}" alt="${article.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${article.name}</h2>
                    <p>${article.color}</p>
                    <p>${article.price} &euro;</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
  `;
    document.getElementById("cart__items").innerHTML += html;
  }
  // Affichage de la quantité et du prix total
  document.getElementById("totalQuantity").innerHTML = qty;
  document.getElementById("totalPrice").innerHTML = Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  //
  //------ Fonction qui recalcule le total des quantité et du prix
  function recalc() {
    let quantity = 0;
    let total = 0;
    for (article of panier) {
      quantity += parseInt(article.quantity);
      total += parseFloat(article.price) * parseInt(article.quantity);
    }
    document.getElementById("totalQuantity").innerHTML = quantity;
    document.getElementById("totalPrice").innerHTML = Intl.NumberFormat(
      "fr-FR",
      {
        style: "currency",
        currency: "EUR",
      }
    ).format(total);
  }

  // Boucle qui ajoute un eventListener sur toute les vignettes d'article affichés dans le panier
  for (let i = 0; i < vignettes.length; i++) {
    let vignette = vignettes[i];
    vignette.addEventListener("input", (e) => {
      //On envoie la quantité selectionnée dans le panier
      panier[i].quantity = parseInt(e.target.value);
      // On met à jour le localstorage
      localStorage.setItem("panier", JSON.stringify(panier));
      // on lance la fonction qui va mettre à jour le prix et le total de la page panier
      recalc();
    });
  }
  //
  // Boucle qui ajoute un eventListener sur toute les vignettes d'article affichés dans le panier
  for (let i = 0; i < vignettes.length; i++) {
    let suppressions = document.getElementsByClassName("deleteItem");
    let suppr = suppressions[i];
    let vignette = vignettes[i];
    suppr.addEventListener("click", () => {
      // On supprime de notre panier l'élément de la boucle selectionné via splice()
      panier.splice(i, 1);
      // on supprime le code HTML de ce même élément
      vignette.remove();
      // On met à jour le localstorage
      localStorage.setItem("panier", JSON.stringify(panier));
      // on lance la fonction qui va mettre à jour le prix et le total de la page panier
      recalc();
    });
  }

  //
  //------Formulaire utilisateur

  // On récupère nos balises d'input du formulaire
  inputFirstName = document.querySelectorAll(".cart__order__form__question")[0];
  inputLastName = document.querySelectorAll(".cart__order__form__question")[1];
  inputAddress = document.querySelectorAll(".cart__order__form__question")[2];
  inputCity = document.querySelectorAll(".cart__order__form__question")[3];
  inputEmail = document.querySelectorAll(".cart__order__form__question")[4];
  // On récupère aussi les balise qui afficheront les erreurs si il y en a
  errFirstName = document.querySelectorAll(".cart__order__form__question p")[0];
  errLastName = document.querySelectorAll(".cart__order__form__question p")[1];
  errAddress = document.querySelectorAll(".cart__order__form__question p")[2];
  errCity = document.querySelectorAll(".cart__order__form__question p")[3];
  errEmail = document.querySelectorAll(".cart__order__form__question p")[4];
  // On récupère le bouton de soummision di formulaire
  submitInfo = document.getElementById("order");

  validForm = false;
  // EventListener qui récupère le prénom
  inputFirstName.addEventListener("change", (e) => {
    validFirstName(e.target.value);
    contact.firstName = e.target.value;
  });
  // EventListener qui récupère le nom de famille
  inputLastName.addEventListener("change", (e) => {
    validLastName(e.target.value);
    contact.lastName = e.target.value;
  });
  // EventListener qui récupère l'adresse
  inputAddress.addEventListener("change", (e) => {
    contact.address = e.target.value;
  });
  // EventListener qui récupère la ville
  inputCity.addEventListener("change", (e) => {
    contact.city = e.target.value;
  });
  // EventListener qui récupère l'email
  inputEmail.addEventListener("change", (e) => {
    validEmail(e.target.value);
    contact.email = e.target.value;
  });
  // Fonction qui vérifie à l'aide d'une RegExp que le champ prénom ne contiens pas de chiffre
  function validFirstName(firstName) {
    if (!/[0-9]/.test(firstName)) {
      errFirstName.innerText = "";
      validForm = true;
    } else {
      errFirstName.innerText = "Votre prénom ne peut pas contenir de chiffre";
      validForm = false;
    }
  }
  // Fonction qui vérifie à l'aide d'une RegExp que le champ nom ne contiens pas de chiffre
  function validLastName(lastName) {
    if (!/[0-9]/.test(lastName)) {
      errLastName.innerText = "";
      validForm = true;
    } else {
      errLastName.innerText = "Votre nom ne peut pas contenir de chiffre";
      return false;
    }
  }
  // Fonction qui vérifie à l'aide d'une RegExp que le champ email est au format "texte@texte.txt"
  function validEmail(email) {
    let emailRegExp = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );
    if (emailRegExp.test(email)) {
      errEmail.innerHTML = "";
      validForm = true;
    } else {
      errEmail.innerHTML = "Votre mail n'est pas valide !";
      validForm = false;
    }
  }
  // Eventlistener qui fonctionne seulement si tout les champs sont correctement rempli
  submitInfo.addEventListener("click", (e) => {
    e.preventDefault();
    // Fonction fetch qui envoie à l'API un objet contenant l'objet 'contact' et le tableau 'products'
    async function sendData() {
      await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact, products }),
      })
        // Ensuite on stock la réponse de l'api (orderId)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          orderId = data.orderId;
        });
      // SI on a bien obtenu un orderId en réponse on redirige notre utilisateur
      if (orderId != undefined || orderId != "") {
        location.href = "confirmation.html?" + orderId;
      }
    }
    function collectDatas() {
      for (let article of panier) {
        products.push(article.id);
      }
    }
    if (validForm) {
      collectDatas();
      sendData();
    }
  });
}
// SINON c'est que nous sommes sur la page "confirmation.html" donc on affiche le numero de commande stocké dans l'URL
// et on supprime le panier du localStorage pour pouvoir passer d'autres commandes
else {
  orderId = window.location.search.replace("?", "");
  document.getElementById("orderId").innerHTML = orderId;
  localStorage.removeItem("panier");
}
