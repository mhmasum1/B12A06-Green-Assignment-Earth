// HTML Elements
const categoryList = document.getElementById("category-list");
const plantList = document.getElementById("plant-list");

// Global variable to store all plants
let allPlants = [];

// Load everything on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadPlants();
});


// -------- Fetch and Render Categories --------
function loadCategories() {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then(res => res.json())
        .then(data => {
            const categories = data.categories;
            renderCategories(categories);
        })
}

function renderCategories(categories) {
    categoryList.innerHTML = ""; // Clear before adding

    // "All" button
    const liAll = document.createElement("li");
    liAll.textContent = "All Trees";
    liAll.className = "px-2 py-1 cursor-pointer hover:bg-green-600 hover:text-white font-semibold";
    liAll.addEventListener("click", () => renderPlants(allPlants));
    categoryList.appendChild(liAll);

    // Show category list dynamically
    categories.forEach(category => {
        const li = document.createElement("li");
        li.textContent = category.category_name;
        li.className = "px-2 py-1 cursor-pointer hover:bg-green-600 hover:text-white";
        li.addEventListener("click", () => {
            const filtered = allPlants.filter(p => p.category === category.category_name);
            renderPlants(filtered);
        });
        categoryList.appendChild(li);
    });
}


// -------- Fetch and Render Plants --------
function loadPlants() {
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(data => {
            allPlants = data.plants; // Save globally
            renderPlants(allPlants); // Default load = show all
        })
        .catch(err => console.error("Error loading plants:", err));
}

function renderPlants(plantsToShow) {
    plantList.innerHTML = ""; // Clear before rendering new

    if (plantsToShow.length === 0) {
        plantList.innerHTML = `<p class="text-center text-gray-500 col-span-3">No plants found</p>`;
        return;
    }

    plantsToShow.forEach(p => {
        const card = document.createElement("div");
        card.className =
            "bg-white rounded-lg shadow p-4 flex flex-col items-center text-center";

        card.innerHTML = `
  <img src="${p.image}" alt="" class="w-full h-32 object-cover rounded mb-2">
  <h3 class="font-semibold text-left w-full mb-1">${p.name}</h3>
  <p class="text-sm text-gray-600 text-left mb-2">${p.description}</p>
  <div class="flex justify-between items-center w-full my-4">
  <button class="px-1 py-1 text-sm text-green-600 border border-green-600 rounded-2xl bg-white hover:bg-green-600 hover:text-white">
    ${p.category}
  </button>
  <p class="font-bold text-green-600 m-0">৳${p.price}</p>
</div>

  <button class="btn btn-primary bg-green-600 w-full border-none rounded-2xl ">Add to Cart</button>
`;



        plantList.appendChild(card);
    });
}
