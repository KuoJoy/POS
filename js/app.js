const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const button = document.querySelector("#submit-button");

let productData = [];
let cartItems = [];
let total = 0;

axios.get("https://kuojoy.github.io/products.json").then((res) => {
  productData = res.data;
  displayProducts(productData);
});

function displayProducts(products) {
  products.forEach((product) => {
    menu.innerHTML += `
    <div class="col-3 my-2">
      <div class="card">
        <img src="${product.imgUrl}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price}</p>
          <button id="${product.id}" class="btn btn-primary order-btn fs-6">加入購物車</button>
        </div>
      </div>
    </div>
    `;
  });
}

function addToCart(event) {
  const id = event.target.id;
  const addedProduct = productData.find((product) => product.id === id);
  const name = addedProduct.name;
  const price = addedProduct.price;
  const targetItem = cartItems.find((item) => item.id === id);
  if (targetItem) {
    targetItem.quantity += 1;
  } else {
    cartItems.push({
      id,
      name,
      price,
      quantity: 1,
    });
  }
  renderPage();

  calculateTotal(price);
}

function renderPage() {
  cart.innerHTML = cartItems
    .map(
      (item) =>
        `<li id="${
          item.id
        }" class="list-group-item d-flex justify-content-between align-items-center">${
          item.name
        } X ${item.quantity} 小計：$${
          item.price * item.quantity
        }<div><a href="#" class="btn btn-light ml-3 plus">+</a><a href="#" class="btn btn-light ml-3 minus">-</a><span class="badge text-bg-danger ms-2 delete">X</span></div></li>`
    )
    .join("");
}

function calculateTotal(amount) {
  total += amount;
  totalAmount.textContent = total;
}

function submit() {
  if (cart.innerText === "") return;
  let string = "";
  cartItems.forEach((item) => {
    string += `
    ${item.name} X ${item.quantity} 小計：$${item.price * item.quantity}
    `;
  });

  const text = `
  感謝購買！！
  ${string}
  共$${totalAmount.innerText}元！
  `;

  alert(text);
  reset();
}

function reset() {
  cart.innerHTML = "";
  totalAmount.innerText = "--";
  cartItems = [];
  total = 0;
}

function addOrRemove(event) {
  event.preventDefault();
  const id = event.target.parentElement.parentElement.id;
  const targetItem = cartItems.find((item) => item.id === id);
  if (event.target.matches(".plus")) {
    targetItem.quantity += 1;
    renderPage();
  } else if (event.target.matches(".minus")) {
    if (targetItem.quantity - 1 < 0) {
      return;
    } else {
      targetItem.quantity -= 1;
      renderPage();
    }
  } else if (event.target.matches(".delete")) {
    let index = cartItems.indexOf(targetItem);
    cartItems.splice(index, 1);
    renderPage();
  }
  total = 0;
  cartItems.forEach((item) => (total += item.quantity * item.price));
  totalAmount.textContent = total;
}

menu.addEventListener("click", addToCart);

button.addEventListener("click", submit);

cart.addEventListener("click", addOrRemove);
