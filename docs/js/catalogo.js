document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("catalogo-grid");

    fetch("items.json")
        .then(response => response.json())
        .then(products => {
            grid.innerHTML = "";

            products.forEach(product => {
                const item = document.createElement("div");
                item.classList.add("product");

                item.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">${product.price} €</p>
            <a href="${product.link}" class="btn">Comprar</a>
          </div>
        `;

                grid.appendChild(item);
            });
        })
        .catch(error => console.error("Error cargando productos:", error));
});
