// Function to add items to the cart
function addtoCart(button) {
    var product = button.parentNode; // Get the parent node of the button (the product div)
    var name = product.getAttribute('data-name'); // Get the name of the product
    var price = parseFloat(product.getAttribute('data-price')); // Get the price of the product
    var imageSrc = product.querySelector('img').src; // Get the source of the product image

    // Get the selected quantity
    var quantity = parseInt(product.querySelector('select').value);

    // Calculate total price based on quantity
    var totalPrice = price * quantity;

    // Create a new cart item element
    var cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    // Create image element for the cart item
    var cartImage = document.createElement('img');
    cartImage.src = imageSrc;
    cartItem.appendChild(cartImage);

    // Create span element for the name of the product
    var cartName = document.createElement('span');
    cartName.textContent = name;
    cartItem.appendChild(cartName);

    // Create span element for the price of the product
    var cartPrice = document.createElement('span');
    cartPrice.textContent = 'Rs. ' + totalPrice.toFixed(2);
    cartItem.appendChild(cartPrice);

    // Append the cart item to the cart
    document.getElementById('cart-items').appendChild(cartItem);

    // Update the total price
    var totalPriceElement = document.getElementById('cart-total');
    var currentTotalPrice = parseFloat(totalPriceElement.textContent);
    var newTotalPrice = currentTotalPrice + totalPrice;
    totalPriceElement.textContent = newTotalPrice.toFixed(2);

    // Show the cart
    document.getElementById('Cart').classList.remove('hidden');
}

// Function to proceed to checkout
function proceedToCheckout() {
    // Get the cart items
    var cartItems = document.querySelectorAll('.cart-item');

    // Check if there are any items in the cart
    if (cartItems.length === 0) {
        // If no items are selected, display a validation message
        alert('Please select at least one item before proceeding to checkout.');
        return; // Stop further execution
    }

    // If at least one item is selected, proceed to checkout
    // Replace this alert with your actual checkout logic
    alert('Proceeding to checkout!');
}
