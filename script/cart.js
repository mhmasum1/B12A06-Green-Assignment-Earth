// ===============================
// Cart Functionality
// ===============================

// Select Elements
const historyList = document.getElementById("history-list");
const totalPriceElement = document.getElementById("total-price");

// Cart Array
let cart = [];

// ===============================
// 1. Add to Cart
// ===============================
function addToCart(plant) {
    // Add plant to cart array
    cart.push(plant);

    // Render the cart UI
    renderCart();
}

// ===============================
// 2. Render Cart List & Total Price
// ===============================
function renderCart() {
    historyList.innerHTML = ""; // Clear previous cart items
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const li = document.createElement("li");
        li.className = "flex justify-between items-center p-2 bg-green-100 rounded";

        li.innerHTML = `
            <div class="flex flex-col">
            <span class="text-sm font-medium">${item.name}</span>
             <span class="text-sm text-green-600">৳${item.price}</span>
             </div>
            <div class="flex items-center gap-2">
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700">
                    ❌
                </button>
            </div>
        `;

        historyList.appendChild(li);
    });

    // Update total price
    totalPriceElement.textContent = `৳${total}`;
}

// ===============================
// 3. Remove from Cart
// ===============================
function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item at this index
    renderCart(); // Update the cart UI
}

// ===============================
// 4. Listen to "Add to Cart" button clicks
// ===============================

// This will run after plants are rendered
document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("add-to-cart")) {
        console.log("add to cart button clicked")
        const plantId = e.target.getAttribute("data-id");
        const plantName = e.target.getAttribute("data-name");
        const plantPrice = parseFloat(e.target.getAttribute("data-price"));

        const plant = {
            id: plantId,
            name: plantName,
            price: plantPrice,
        };

        addToCart(plant);
        alert(`${plant.name} has been added to the cart`);
    }
});
