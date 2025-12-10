// PRODUCTOS DESTACADOS

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("product-grid");

  fetch("items.json")
    .then(response => response.json())
    .then(products => {
      grid.innerHTML = "";

      const featuredProducts = products.filter(p => p.featured === true);

      featuredProducts.forEach(product => {
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

// CONTACTO

const WEBHOOK_URL = "https://discord.com/api/webhooks/1447273219840020723/3HspHJfDKKpw2b66Z-fuS_UA4__oUrAve_SK1Jj0ohsIGsFdN4KYKieD-CiBuCkYt-qY";

document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("mensaje").value;

  const payload = {
    username: "QRew web",
    avatar_url: "https://raw.githubusercontent.com/QRew-shop/web/refs/heads/main/docs/imagenes/logo.png",
    content: "<@&1447273719113453771>", // texto fuera del embed
    embeds: [
      {
        title: "📩 Nuevo mensaje desde la web",
        color: 0x3498db,
        fields: [
          { name: "👤 Nombre", value: nombre, inline: false },
          { name: "📧 Email", value: email, inline: false },
          { name: "📝 Mensaje", value: mensaje, inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Formulario QRew"
        }
      }
    ]
  };

  const cooldown = 60000; // 1 min
  const lastSent = localStorage.getItem("lastSent") || 0;
  const remaining = cooldown - (Date.now() - lastSent);

  if (remaining > 0) {
    const secs = Math.ceil(remaining / 1000); // redondea hacia arriba
    const msg = `⏳ Debes esperar ${secs} segundos antes de enviar otro mensaje.`;

    document.getElementById("statusMsg").innerText = msg;
    alert(msg);
    return;
  }

  localStorage.setItem("lastSent", Date.now());

  document.getElementById("statusMsg").innerText = "Enviando...";

  // 1️⃣ ENVIAR WEBHOOK
  let webhookOK = false;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    webhookOK = res.ok;
  } catch (err) {
    webhookOK = false;
  }

  // 2️⃣ ENVIAR EMAIL CON EMAILJS
  const emailParams = {
    name: nombre,
    email: email,
    message: mensaje
  };

  let emailOK = false;

  try {
    await emailjs.send("service_1oxi215", "template_o1seluh", emailParams);
    await emailjs.send("service_1oxi215", "template_9n8ymil", emailParams);
    emailOK = true;
  } catch (err) {
    emailOK = false;
  }

  // RESULTADO FINAL
  if (webhookOK && emailOK) {
    document.getElementById("statusMsg").innerText = "✅ Mensaje enviado. Revisa tu correo en la carpeta de spam.";
  } else if (webhookOK && !emailOK) {
    document.getElementById("statusMsg").innerText = "⚠️ Mensaje enviado, pero no hemos podido enviarte un correo.";
  } else if (!webhookOK && emailOK) {
    document.getElementById("statusMsg").innerText = "✅ Mensaje enviado. Revisa tu correo en la carpeta de spam.";
  } else {
    document.getElementById("statusMsg").innerText = "❌ No se pudo enviar el mensaje.";
  }
  document.getElementById("contact-form").reset();
});