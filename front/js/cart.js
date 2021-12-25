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
//------Affichage des vignettes pour les éléments du panier
if (panier == null) {
  document.getElementById(
    "cart__items"
  ).innerHTML = `<h3 style="text-align: center; margin-bottom: 50px;">Vous n'avez aucun article dans votre panier !</h3>`;
} else if (location.href.search("confirmation") < 0) {
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
  document.getElementById("totalQuantity").innerHTML = qty;
  document.getElementById("totalPrice").innerHTML = Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  //
  //------Modificateur quantité panier
  let recalc = function () {
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
  };

  for (let i = 0; i < vignettes.length; i++) {
    let vignette = vignettes[i];
    vignette.addEventListener("input", (e) => {
      panier[i].quantity = parseInt(e.target.value);
      localStorage.setItem("panier", JSON.stringify(panier));
      recalc();
    });
  }
  //
  // Bouton de suppression d'item du panier
  for (let i = 0; i < vignettes.length; i++) {
    let suppressions = document.getElementsByClassName("deleteItem");
    let suppr = suppressions[i];
    let vignette = vignettes[i];
    suppr.addEventListener("click", () => {
      panier.splice(i, 1);
      vignette.remove();
      localStorage.setItem("panier", JSON.stringify(panier));
      recalc();
    });
  }

  //
  //------Formulaire utilisateur

  inputFirstName = document.querySelectorAll(".cart__order__form__question")[0];
  errFirstName = document.querySelectorAll(".cart__order__form__question p")[0];
  inputLastName = document.querySelectorAll(".cart__order__form__question")[1];
  errLastName = document.querySelectorAll(".cart__order__form__question p")[1];
  inputAddress = document.querySelectorAll(".cart__order__form__question")[2];
  errAddress = document.querySelectorAll(".cart__order__form__question p")[2];
  inputCity = document.querySelectorAll(".cart__order__form__question")[3];
  errCity = document.querySelectorAll(".cart__order__form__question p")[3];
  inputEmail = document.querySelectorAll(".cart__order__form__question")[4];
  errEmail = document.querySelectorAll(".cart__order__form__question p")[4];
  submitInfo = document.getElementById("order");

  validForm = false;
  emailRegExp = "";
  inputFirstName.addEventListener("change", (e) => {
    validFirstName(e.target.value);
    contact.firstName = e.target.value;
  });
  inputLastName.addEventListener("change", (e) => {
    validLastName(e.target.value);
    contact.lastName = e.target.value;
  });
  inputAddress.addEventListener("change", (e) => {
    contact.address = e.target.value;
  });
  inputCity.addEventListener("change", (e) => {
    contact.city = e.target.value;
  });
  inputEmail.addEventListener("change", (e) => {
    validEmail(e.target.value);
    contact.email = e.target.value;
  });
  const validFirstName = (firstName) => {
    if (!/[0-9]/.test(firstName)) {
      errFirstName.innerText = "";
      validForm = true;
    } else {
      errFirstName.innerText = "Votre prénom ne peut pas contenir de chiffre";
      validForm = false;
    }
  };
  const validLastName = (lastName) => {
    if (!/[0-9]/.test(lastName)) {
      errLastName.innerText = "";
      validForm = true;
    } else {
      errLastName.innerText = "Votre nom ne peut pas contenir de chiffre";
      return false;
    }
  };
  const validEmail = (email) => {
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
  };
  submitInfo.addEventListener("click", (e) => {
    e.preventDefault();
    if (validForm) {
      let collectDatas = () => {
        for (let article of panier) {
          products.push(article.id);
        }
      };
      collectDatas();
      let sendData = async function () {
        await fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contact, products }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            orderId = data.orderId;
          });
        if (orderId != undefined || orderId != "") {
          location.href = "confirmation.html?" + orderId;
        }
      };
      sendData();
    } else {
    }
  });
} else {
  orderId = window.location.search.replace("?", "");
  document.getElementById("orderId").innerHTML = orderId;
  localStorage.removeItem("panier");
}

// submitInfo.addEventListener("click", (e) => {
//   e.preventDefault();
//   if (contact.firstName == undefined || contact.firstName == "") {
//     errFirstName.innerHTML = "Ce champ ne doit pas être vide";
//   }
//   if (contact.lastName == undefined || contact.lastName == "") {
//     errLastName.innerHTML = "Ce champ ne doit pas être vide";
//   }
//   if (contact.address == undefined || contact.address == "") {
//     errAddress.innerHTML = "Ce champ ne doit pas être vide";
//   }
//   if (contact.city == undefined || contact.city == "") {
//     errCity.innerHTML = "Ce champ ne doit pas être vide";
//   }
//   if (contact.email == undefined || contact.email == "") {
//     errEmail.innerHTML = "Ce champ ne doit pas être vide";
//   } else {
//     for (let article of panier) {
//       products.push(article.id);
//     }
//
//   }
// });
