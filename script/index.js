// DOM Elements
const categoryList = document.getElementById("category-list");
const plantList = document.getElementById("plant-list");
const treeModal = document.getElementById("treeModal");
const closeModalBtn = document.getElementById("closeModal");
const loadingSpinner = document.getElementById("loadingSpinner");

function showSpinner() {
    loadingSpinner.classList.remove("hidden");
}

function hideSpinner() {
    loadingSpinner.classList.add("hidden");
}


// API Base URL
const API_URL = "https://openapi.programming-hero.com/api/plants";

// ===============================
// 1. Fetch All Plants on Page Load
// ===============================
showSpinner(); // Fetch er age spinner show

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        const plants = data.plants;
        renderCategories(plants);
        renderPlants(plants); // Show all plants initially
        hideSpinner(); // Data ashar por spinner hide
    })
    .catch(err => console.error("Error fetching plants:", err));

// ===============================
// 2. Render Categories
// ===============================
function renderCategories(plants) {
    const categories = [...new Set(plants.map(p => p.category))];
    categoryList.innerHTML = ""; // Clear previous categories

    // 'All Trees' button
    const liAll = document.createElement("li");
    liAll.textContent = "All Trees";
    liAll.className =
        "px-3 py-1 cursor-pointer  hover:bg-green-600 hover:text-white font-semibold";

    // Default active
    liAll.classList.add("bg-green-600", "text-white");

    liAll.addEventListener("click", () => {
        setActiveCategory(liAll);
        renderPlants(plants);
    });
    categoryList.appendChild(liAll);

    // Dynamic categories
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat;
        li.className =
            "px-3 py-1 cursor-pointer  hover:bg-green-600 hover:text-white";
        li.addEventListener("click", () => {
            setActiveCategory(li);
            const filtered = plants.filter(p => p.category === cat);
            renderPlants(filtered);
        });
        categoryList.appendChild(li);
    });
}

// Helper function to manage active state
function setActiveCategory(activeLi) {
    const allLi = categoryList.querySelectorAll("li");
    allLi.forEach(li => li.classList.remove("bg-green-600", "text-white"));
    activeLi.classList.add("bg-green-600", "text-white");
}


// ===============================
// 3. Render Plant Cards (Unchanged Design)
// ===============================
function renderPlants(plantsToShow) {
    plantList.innerHTML = ""; // Clear old content

    plantsToShow.forEach(p => {
        const card = document.createElement("div");
        card.className =
            "bg-white rounded-lg shadow p-4 flex flex-col items-center text-center";

        // ORIGINAL DESIGN (kept as you provided)
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


        // Tree Name click => Open modal
        const treeName = card.querySelector("h3");
        treeName.addEventListener("click", () => openTreeModal(p.id));

        plantList.appendChild(card);
    });
}

// 4. Fetch Plant Details & Show Modal
function openTreeModal(id) {
    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
        .then(res => res.json())
        .then(data => {
            if (!data.plants) return;

            const plant = data.plants;

            // Update modal content
            document.getElementById("modalName").textContent = plant.name;
            document.getElementById("modalImage").src = plant.image;
            document.getElementById("modalCategory").textContent = plant.category;
            document.getElementById("modalPrice").textContent = `৳${plant.price}`;
            document.getElementById("modalDescription").textContent = plant.description;

            // Show modal
            const treeModal = document.getElementById("treeModal");
            treeModal.classList.remove("hidden");
        })
        .catch(err => console.error("Error fetching plant details:", err));
}

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("treeModal").classList.add("hidden");
});


// ===============================
// 5. Close Modal Logic
// ===============================
closeModalBtn.addEventListener("click", () => {
    treeModal.classList.remove("flex");
    treeModal.classList.add("hidden");
});

// Close modal if clicking on background
treeModal.addEventListener("click", (e) => {
    if (e.target === treeModal) {
        treeModal.classList.remove("flex");
        treeModal.classList.add("hidden");
    }
});
