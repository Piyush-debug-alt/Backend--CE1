
const products = [
    { id: 1, name: "Headphones", price: 999, category: "Electronics" },
    { id: 2, name: "Keyboard", price: 799, category: "Electronics" },
    { id: 3, name: "T-Shirt", price: 499, category: "Clothing" },
    { id: 4, name: "Shoes", price: 1499, category: "Clothing" }
];

let cart = [];
let couponApplied = false;

const productBox = document.getElementById("products");
const cartBox = document.getElementById("cart");

// Display products with images and quantity controls.
function showProducts() {
    let list = [...products];

    const category = document.getElementById("category").value;
    const sort = document.getElementById("sort").value;

    // Filter products by category.
    if (category !== "All") {
        list = list.filter(p => p.category === category);
    }

    // Sort products by price.
    if (sort === "low") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        list.sort((a, b) => b.price - a.price);
    }

    productBox.innerHTML = "";

    list.forEach(p => {
        const item = cart.find(c => c.id === p.id);
        const quantity = item ? item.quantity : 0;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-top">
                <h3>${p.name}</h3>

                <div class="quantity">
                    <button
                        data-action="minus"
                        data-id="${p.id}"
                        aria-label="Decrease ${p.name} quantity">−</button>

                    <span>${quantity}</span>

                    <button
                        data-action="plus"
                        data-id="${p.id}"
                        aria-label="Increase ${p.name} quantity">+</button>
                </div>
            </div>

            <img src="blank.png" alt="${p.name}">

            <p>Category: ${p.category}</p>
            <p class="price">₹${p.price.toFixed(2)}</p>

            <button class="add-btn"
                data-action="add"
                data-id="${p.id}">
                Add to Cart
            </button>
        `;

        productBox.appendChild(card);
    });

    if (list.length === 0) {
        productBox.innerHTML = "<p>No products found.</p>";
    }
}

// Add a product or change its quantity.
function changeQuantity(id, action) {
    const product = products.find(p => p.id === id);
    let item = cart.find(p => p.id === id);

    if (action === "add" || action === "plus") {
        if (item) {
            item.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
    }

    if (action === "minus" && item) {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(p => p.id !== id);
        }
    }

    showCart();
}

// Display cart items and calculate prices.
function showCart() {
    cartBox.innerHTML = "";

    if (cart.length === 0) {
        cartBox.innerHTML =
            "<p>Your cart is empty. Add some products!</p>";
    }

    cart.forEach(p => {
        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <div>
                <strong>${p.name}</strong>

                <p>₹${p.price.toFixed(2)} × ${p.quantity}</p>

                <p>
                    <strong>
                        Amount: ₹${(p.price * p.quantity).toFixed(2)}
                    </strong>
                </p>
            </div>

            <div class="cart-actions">
                <button data-action="minus" data-id="${p.id}">−</button>

                <strong>${p.quantity}</strong>

                <button data-action="plus" data-id="${p.id}">+</button>

                <button data-action="remove" data-id="${p.id}">
                    Remove
                </button>
            </div>
        `;

        cartBox.appendChild(item);
    });

    // Calculate subtotal.
    const subtotal = cart.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
    );

    // Calculate 10% discount if coupon is applied.
    const discount = couponApplied ? subtotal * 0.10 : 0;

    // Calculate final total.
    const total = subtotal - discount;

    document.getElementById("subtotal").textContent =
        subtotal.toFixed(2);

    document.getElementById("discount").textContent =
        discount.toFixed(2);

    document.getElementById("total").textContent =
        total.toFixed(2);

    // Reset coupon when cart becomes empty.
    if (cart.length === 0) {
        couponApplied = false;

        document.getElementById("message").textContent = "";
    }

    // Update quantities displayed on product cards.
    showProducts();
}

// Handle buttons on product cards.
productBox.addEventListener("click", function (e) {
    const button = e.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    changeQuantity(id, action);
});

// Handle buttons inside the shopping cart.
cartBox.addEventListener("click", function (e) {
    const button = e.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "remove") {
        cart = cart.filter(p => p.id !== id);
        showCart();
    } else {
        changeQuantity(id, action);
    }
});

// Category filtering.
document.getElementById("category").addEventListener(
    "change",
    showProducts
);

// Price sorting.
document.getElementById("sort").addEventListener(
    "change",
    showProducts
);

// Search bar intentionally has no event listener.
// Typing in it will not filter products.

// Apply SAVE10 coupon.
document.getElementById("apply").addEventListener("click", function () {
    const coupon = document.getElementById("coupon").value
        .trim()
        .toUpperCase();

    const message = document.getElementById("message");

    if (coupon === "SAVE10" && cart.length > 0) {
        couponApplied = true;
        message.textContent = "Success! 10% discount applied.";
    } else {
        couponApplied = false;

        message.textContent = cart.length === 0
            ? "Add products before applying a coupon."
            : "Invalid coupon. Try SAVE10.";
    }

    showCart();
});

// Simulated checkout.
document.getElementById("checkout").addEventListener(
    "click",
    function () {
        const message = document.getElementById("checkout-message");

        if (cart.length === 0) {
            message.textContent = "Your cart is empty!";
            return;
        }

        const total = document.getElementById("total").textContent;

        message.textContent =
            "Order placed successfully! Total: ₹" + total;

        // Clear cart after checkout.
        cart = [];
        couponApplied = false;

        document.getElementById("coupon").value = "";
        document.getElementById("message").textContent = "";

        showCart();
    }
);

// Initial display.
showProducts();
showCart();
