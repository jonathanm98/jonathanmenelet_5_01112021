for (let i = 0; i < localStorage.length; i++) {
  let cartItem = JSON.parse(localStorage.getItem(localStorage.key(i)));
  console.log(cartItem);
}
