document.addEventListener("DOMContentLoaded", () => {
  const restaurantList = document.getElementById("restaurantList");
  const menuSection = document.getElementById("menuSection");
  const cartItems = document.getElementById("cartItems");
  const backToRestaurants = document.getElementById("backToRestaurants");

  // Show restaurants list
  function showRestaurants() {
    restaurantList.classList.add("active");
    menuSection.classList.remove("active");
  }

  // Show menu for the selected restaurant
  function showMenu(restaurantName) {
    const menuTitle = document.getElementById("menuTitle");
    menuTitle.textContent = `Menu of ${restaurantName}`;
    restaurantList.classList.remove("active");
    menuSection.classList.add("active");
  }

  // Add to Cart
  function addToCart(itemName) {
    const li = document.createElement("li");
    li.textContent = itemName;
    cartItems.appendChild(li);
  }

  // Event Listeners
  document.querySelectorAll(".restaurant").forEach((restaurant) => {
    restaurant.addEventListener("click", () => {
      const restaurantName = restaurant.textContent;
      showMenu(restaurantName);
    });
  });

  document.querySelectorAll(".addToCartBtn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const itemName = e.target.previousSibling.textContent.trim();
      addToCart(itemName);
    });
  });

  backToRestaurants.addEventListener("click", showRestaurants);
});
