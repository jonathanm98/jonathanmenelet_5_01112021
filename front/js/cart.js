let panier = JSON.parse(localStorage.getItem("panier"));
let qty = 0;
let total = 0;
orderInfo = [];
//
//------Affichage des vignettes pour les éléments du panier
if (panier == null) {
  document.getElementById(
    "cart__items"
  ).innerHTML = `<h3 style="text-align: center; margin-bottom: 50px;">Vous n'avez aucun article dans votre panier !</h3>`;
} else if (location.href.search("confirmation") > 0) {
} else {
  for (let article of panier) {
    qty += article.quantity;
    total += article.quantity * article.price;
    let html = `
    <article class="cart__item" data-id="${article.id}" data-color="${article.color}">
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
  document.getElementById("totalQuantity").innerHTML = qty;
  document.getElementById("totalPrice").innerHTML = Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(total);
}
//
//------Modificateur quantité panier
let vignettes = document.getElementsByClassName("cart__item");
for (let i = 0; i < vignettes.length; i++) {
  let vignette = vignettes[i];
  vignette.addEventListener("input", (e) => {
    panier[i].quantity = parseInt(e.target.value);
    localStorage.setItem("panier", JSON.stringify(panier));

    console.log(panier[i]);
  });
}
//
// Bouton de suppression d'item du panier
for (let i = 0; i < vignettes.length; i++) {
  let suppressions = document.getElementsByClassName("deleteItem");
  let suppr = suppressions[i];
  suppr.addEventListener("click", () => {
    panier.splice(i, 1);
    localStorage.setItem("panier", JSON.stringify(panier));
  });
}

//
//------Formulaire utilisateur

inputFirstName = document.querySelectorAll(".cart__order__form__question")[0];
errFirstName = document.querySelectorAll(".cart__order__form__question p")[0];
inputLastName = document.querySelectorAll(".cart__order__form__question")[1];
errLastName = document.querySelectorAll(".cart__order__form__question p")[1];
inputAdress = document.querySelectorAll(".cart__order__form__question")[2];
errAdress = document.querySelectorAll(".cart__order__form__question p")[2];
inputCity = document.querySelectorAll(".cart__order__form__question")[3];
errCity = document.querySelectorAll(".cart__order__form__question p")[3];
inputEmail = document.querySelectorAll(".cart__order__form__question")[4];
errEmail = document.querySelectorAll(".cart__order__form__question p")[4];
submitInfo = document.getElementById("order");

inputFirstName.addEventListener("input", (e) => {
  let regex = new RegExp(/[0-9]/g);
  let input = e.target.value;
  if (input.search(regex) >= 0) {
    errFirstName.innerHTML =
      "Vous ne pouvez pas avoir de chiffre dans votre prénom !";
  } else if (input.length >= 50) {
    errFirstName.innerHTML = "Votre prénom ne peut pas être si long !";
  } else {
    orderInfo.firstName = input;
    errFirstName.innerHTML = "";
  }
});

inputLastName.addEventListener("input", (e) => {
  let regex = new RegExp(/[0-9]/g);
  let input = e.target.value;
  if (input.search(regex) >= 0) {
    errLastName.innerHTML =
      "Vous ne pouvez pas avoir de chiffre dans votre nom !";
  } else if (input.length >= 50) {
    errLastName.innerHTML = "Votre nom ne peut pas être si long !";
  } else {
    orderInfo.lastName = input;
    errLastName.innerHTML = "";
  }
});

inputAdress.addEventListener("input", (e) => {
  let input = e.target.value;
  if (input.length >= 50) {
    errAdress.innerHTML = "Votre adresse est trop longue !";
  } else {
    errAdress.innerHTML = "";
    orderInfo.email = input;
  }
});

inputAdress.addEventListener("input", (e) => {
  let input = e.target.value;
  if (input.length >= 60) {
    errAdress.innerHTML = "Votre adresse ne peut pas être aussi longue !";
  } else {
    errAdress.innerHTML = "";
    orderInfo.adress = input;
  }
});

inputCity.addEventListener("input", (e) => {
  let input = e.target.value;
  if (input.length >= 50) {
    errAdress.innerHTML = "Le nom de votre ville est trop long !";
  } else {
    errAdress.innerHTML = "";
    orderInfo.city = input;
  }
});

inputEmail.addEventListener("input", (e) => {
  let regex = new RegExp(/[@]/g);
  let input = e.target.value;
  if (input.search(regex) < 0) {
    errEmail.innerHTML = 'Votre mail doit contenir un "@" !';
  } else {
    errEmail.innerHTML = "";
    orderInfo.email = input;
  }
});
submitInfo.addEventListener("click", (e) => {
  e.preventDefault();
  if (orderInfo.firstName == undefined || orderInfo.firstName == "") {
    errFirstName.innerHTML = "Ce champ ne doit pas être vide";
  }
  if (orderInfo.lastName == undefined || orderInfo.lastName == "") {
    errLastName.innerHTML = "Ce champ ne doit pas être vide";
  }
  if (orderInfo.adress == undefined || orderInfo.adress == "") {
    errAdress.innerHTML = "Ce champ ne doit pas être vide";
  }
  if (orderInfo.city == undefined || orderInfo.city == "") {
    errCity.innerHTML = "Ce champ ne doit pas être vide";
  }
  if (orderInfo.email == undefined || orderInfo.email == "") {
    errEmail.innerHTML = "Ce champ ne doit pas être vide";
  } else {
    // location.href = "confirmation.html";
    console.log("redirection");
  }
});
console.log(panier);
