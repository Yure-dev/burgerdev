const menu = document.getElementById("menu")
const cartModal = document.getElementById("cart-modal")
const cartItems = document.getElementById("cart-items")
const closeModalBtn =document.getElementById("close-modal-btn")
const checkoutBtn = document.getElementById("checkout-btn")
const cartCount = document.getElementById("cart-count")
const cartBtn = document.getElementById("cart-btn")
const address = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const cartTotal = document.getElementById("cart-total")

let cart = [];

//Abrir modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
    updateCartModal();
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})
//Fechar o modal quando clica no botao fechar
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

menu.addEventListener("click",  function(event) {
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addtoCart(name, price)
    }
})

//Function para adicionar no carrinho 
function addtoCart(name,price) {
    const existingItem = cart.find(item => item.name  ===  name)
    if(existingItem)  {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

//Atualiza Carrinho

function updateCartModal(){
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font=medium mt-2">R$${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity;

        cartItems.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerHTML = totalQuantity;
}

// Função para remover item do carrinho

cartItems.addEventListener("click", function (event) {
    if(event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        } 

        cart.splice(index, 1);
        updateCartModal();

    }
}

address.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if(inputValue !== "") {
        address.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


checkoutBtn.addEventListener("click", function() {

     const isOpen = checkOpen();
     if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000, 
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();


         return;
     }

    if (cart.length === 0) return;
    if(address.value === "") {
        addressWarn.classList.remove("hidden")
        address.classList.add("border-red-500")
        return;
    }

    // Enviar pedido para whatsapp

    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "88981877965"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${address.value}`, "_blank")

    cart = []
    updateCartModal();

})   

function checkOpen () {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpenStore = checkOpen();

if(isOpenStore) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}