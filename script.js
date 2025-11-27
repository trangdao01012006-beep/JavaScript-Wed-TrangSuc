const URL = "https://6904571d6b8dabde49634475.mockapi.io/customersay"

const customersayElement = document.getElementById("customer-say")
fetch(URL)
    .then((response) => response.json())
    .then((data) =>{
        data.forEach((element, index) => {
            const {fullname, job, avatar, customersay} = element;

            let activeClass = index == 0 ? "active" : "";

            let htmlContent = `<div class="carousel-item ${activeClass}">
              <div class="row align-items-center">
                <div class="col-md-5 testimonial-img">
                  <img src="${avatar}" class="d-block w-100" alt="customer">
                  <div class="quote-icon">“</div>
                </div>
                <div class="col-md-7">
                  <div class="testimonial-card">
                    <p class="testimonial-name">${fullname}</p>
                    <p class="testimonial-role">${job}</p>
                    <p class="testimonial-text">${customersay}</p>
                  </div>
                </div>
              </div>
            </div>`;
            customersayElement.innerHTML += htmlContent;
        });
    })
    .catch((err) => console.error(err));
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Thêm sản phẩm vào giỏ hàng
document.querySelectorAll(".btn-secondary").forEach((btn, index) => {
    btn.addEventListener("click", function () {
        let productImg = document.querySelectorAll(".product-img")[index];
        flyToCart(productImg);
    });
});

function flyToCart(productImg) {
    let cart = document.getElementById("cart-icon");

    // lấy vị trí ảnh
    let imgRect = productImg.getBoundingClientRect();
    let cartRect = cart.getBoundingClientRect();

    // tạo ảnh bay
    let flyingImg = productImg.cloneNode(true);
    flyingImg.style.position = "fixed";
    flyingImg.style.left = imgRect.left + "px";
    flyingImg.style.top = imgRect.top + "px";
    flyingImg.style.width = productImg.offsetWidth + "px";
    flyingImg.style.transition = "all 1s ease-in-out";
    flyingImg.style.zIndex = "9999";

    document.body.appendChild(flyingImg);

    // sau 10ms để transition hoạt động
    setTimeout(() => {
        flyingImg.style.left = cartRect.left + "px";
        flyingImg.style.top = cartRect.top + "px";
        flyingImg.style.width = "20px";
        flyingImg.style.opacity = "0.2";
    }, 10);

    // xóa ảnh sau animation
    setTimeout(() => {
        flyingImg.remove();
    }, 1100);
}


// ========================================
// Thêm sản phẩm vào localStorage
// ========================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({...product, qty: 1});
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartUI();
}

// ========================================
// Load UI giỏ hàng
// ========================================
function loadCartUI() {
    let list = document.getElementById("cart-list");
    list.innerHTML = "";

    cart.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = `${item.name} - ${item.price} x ${item.qty}
            <button class="remove-btn" data-name="${item.name}">X</button>`;
        list.appendChild(li);
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.onclick = function() {
            let name = this.getAttribute("data-name");
            cart = cart.filter(i => i.name !== name);
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCartUI();
        };
    });
}

// ========================================
// Hiệu ứng bay vào giỏ hàng
// ========================================
function flyToCart(productImg) {
    let cartIcon = document.getElementById("cart-icon");

    let imgRect = productImg.getBoundingClientRect();
    let cartRect = cartIcon.getBoundingClientRect();

    let flyingImg = productImg.cloneNode(true);
    flyingImg.style.position = "fixed";
    flyingImg.style.left = imgRect.left + "px";
    flyingImg.style.top = imgRect.top + "px";
    flyingImg.style.width = productImg.offsetWidth + "px";
    flyingImg.style.transition = "all 1s ease";
    flyingImg.style.zIndex = "99999";

    document.body.appendChild(flyingImg);

    setTimeout(() => {
        flyingImg.style.left = cartRect.left + "px";
        flyingImg.style.top = cartRect.top + "px";
        flyingImg.style.width = "20px";
        flyingImg.style.opacity = "0.2";
    }, 10);

    setTimeout(() => flyingImg.remove(), 1000);
}

// ========================================
// Gán sự kiện Add To Cart cho từng sản phẩm
// ========================================
let addButtons = document.querySelectorAll(".btn-secondary");
let productImgs = document.querySelectorAll(".product-img");

addButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
        let name = this.getAttribute("data-name");
        let price = this.getAttribute("data-price");

        addToCart({name, price});

        flyToCart(productImgs[index]);
    });
});

// ========================================
// Mở/đóng giỏ hàng
// ========================================
document.getElementById("cart-icon").onclick = function() {
    document.getElementById("cart-panel").classList.add("open");
};

document.getElementById("close-cart").onclick = function() {
    document.getElementById("cart-panel").classList.remove("open");
};

// Load giỏ khi vào trang
loadCartUI();

