// DOM Elements
const categoryList = document.getElementById("category-list");
const plantList = document.getElementById("plant-list");
const treeModal = document.getElementById("treeModal");
const closeModalBtn = document.getElementById("closeModal");
const loadingSpinner = document.getElementById("loadingSpinner");

// Show & Hide Spinner
function showSpinner() {
    loadingSpinner.classList.remove("hidden");
}
function hideSpinner() {
    loadingSpinner.classList.add("hidden");
}

// API Base URL
const API_URL = "https://openapi.programming-hero.com/api/plants";

// Fetch All Plants on Page Load
function fetchAllPlants() {
    showSpinner();

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const plants = data.plants;
            renderCategories(plants);
            renderPlants(plants); // Show all plants initially
            hideSpinner();
        })
        .catch(err => {
            console.error("Error fetching plants:", err);
            hideSpinner();
        });
}

// Render Categories
function renderCategories(plants) {
    const categories = [...new Set(plants.map(p => p.category))];
    categoryList.innerHTML = "";

    // "All Trees" Button
    const liAll = createCategoryItem("All Trees", () => {
        setActiveCategory(liAll);
        renderPlants(plants);
    });
    liAll.classList.add("bg-green-600", "text-white"); // Default active
    categoryList.appendChild(liAll);

    // Dynamic Categories
    categories.forEach(cat => {
        const li = createCategoryItem(cat, () => {
            setActiveCategory(li);
            const filtered = plants.filter(p => p.category === cat);
            renderPlants(filtered);
        });
        categoryList.appendChild(li);
    });
}

// create category buttons
function createCategoryItem(text, onClick) {
    const li = document.createElement("li");
    li.textContent = text;
    li.className = "px-3 py-1 cursor-pointer hover:bg-green-600 hover:text-white font-semibold";
    li.addEventListener("click", onClick);
    return li;
}

// Active category style
function setActiveCategory(activeLi) {
    const allLi = categoryList.querySelectorAll("li");
    allLi.forEach(li => li.classList.remove("bg-green-600", "text-white"));
    activeLi.classList.add("bg-green-600", "text-white");
}

// Render Plant Cards
function renderPlants(plantsToShow) {
    plantList.innerHTML = "";

    plantsToShow.forEach(p => {
        const card = document.createElement("div");
        card.className =
            "bg-white rounded-lg shadow p-4 flex flex-col items-center text-center";

        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="w-full h-32 object-cover rounded mb-2">
            <h3 class="font-semibold text-left w-full mb-1 text-green-700 cursor-pointer hover:underline" data-id="${p.id}">
                ${p.name}
            </h3>
            <p class="text-sm text-gray-600 text-left mb-2">${p.description}</p>
            <div class="flex justify-between items-center w-full my-4">
                <button class="px-1 py-1 text-sm text-green-600 border border-green-600 rounded-2xl bg-white hover:bg-green-600 hover:text-white">
                    ${p.category}
                </button>
                <p class="font-bold text-green-600 m-0">৳${p.price}</p>
            </div>
            <button 
                class="btn btn-primary bg-green-600 w-full border-none rounded-2xl add-to-cart"
                data-id="${p.id}" 
                data-name="${p.name}" 
                data-price="${p.price}">
                Add to Cart
            </button>
        `;

        // Tree name click and open modal
        const treeName = card.querySelector("h3");
        treeName.addEventListener("click", () => openTreeModal(p.id));

        plantList.appendChild(card);
    });
}

// Fetch Plant Details & Show Modal
function openTreeModal(id) {
    showSpinner();

    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
        .then(res => res.json())
        .then(data => {
            hideSpinner();
            if (!data.plants) return;

            const plant = data.plants;

            // Update modal content
            document.getElementById("modalName").textContent = plant.name;
            document.getElementById("modalImage").src = plant.image;
            document.getElementById("modalCategory").textContent = plant.category;
            document.getElementById("modalPrice").textContent = `৳${plant.price}`;
            document.getElementById("modalDescription").textContent = plant.description;

            // Show modal
            treeModal.classList.remove("hidden");
            treeModal.classList.add("flex");
        })
        .catch(err => {
            console.error("Error fetching plant details:", err);
            hideSpinner();
        });
}

// Close Modal
closeModalBtn.addEventListener("click", () => closeModal());
treeModal.addEventListener("click", (e) => {
    if (e.target === treeModal) closeModal();
});

function closeModal() {
    treeModal.classList.remove("flex");
    treeModal.classList.add("hidden");
}

// Load initial data
fetchAllPlants();
