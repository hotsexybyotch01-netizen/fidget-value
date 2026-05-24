const homePage = document.getElementById("homePage");
const uploadPage = document.getElementById("uploadPage");
const fidgetForm = document.getElementById("fidgetForm");
const fidgetList = document.getElementById("fidgetList");
const uploadMessage = document.getElementById("uploadMessage");

let fidgets = JSON.parse(localStorage.getItem("fidgets")) || [];

function showUpload() {
  homePage.classList.add("hidden");
  uploadPage.classList.remove("hidden");
}

function showHome() {
  uploadPage.classList.add("hidden");
  homePage.classList.remove("hidden");
  renderFidgets();
}

function saveFidgets() {
  localStorage.setItem("fidgets", JSON.stringify(fidgets));
}

function estimateValue(rarity, status) {
  let value = 0.1;

  if (rarity === "Common") value = 0.2;
  if (rarity === "Uncommon") value = 0.5;
  if (rarity === "Rare") value = 1.0;
  if (rarity === "Ultra Rare") value = 1.8;
  if (rarity === "Legendary") value = 2.6;

  if (status === "Brand New") value += 0.3;
  if (status === "Unused") value += 0.2;
  if (status === "Used") value -= 0.1;
  if (status === "Damaged") value -= 0.4;

  if (value < 0.1) value = 0.1;
  if (value > 3) value = 3;

  return value.toFixed(1);
}

fidgetForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const file = document.getElementById("image").files[0];
  const reader = new FileReader();

  uploadMessage.classList.remove("hidden");
  uploadMessage.textContent = "Uploading to the website...";

  reader.onload = function() {
    setTimeout(() => {
      const name = document.getElementById("name").value;
      const description = document.getElementById("description").value;
      const color = document.getElementById("color").value;
      const size = document.getElementById("size").value;
      const rarity = document.getElementById("rarity").value;
      const status = document.getElementById("status").value;

      const newFidget = {
        id: Date.now(),
        name,
        description,
        color,
        size,
        rarity,
        status,
        image: reader.result,
        value: estimateValue(rarity, status),
        traded: false
      };

      fidgets.unshift(newFidget);
      saveFidgets();

      alert(
        "Thank you for uploading!\n\n⚠️ Warning: Scamming, lying, or exaggerating about your fidget can get your account banned. Please only upload real photos and honest information.\n\nNew registered squishy: " + name
      );

      fidgetForm.reset();
      uploadMessage.classList.add("hidden");
      showHome();
    }, 1200);
  };

  reader.readAsDataURL(file);
});

function renderFidgets() {
  fidgetList.innerHTML = "";

  if (fidgets.length === 0) {
    fidgetList.innerHTML = "<p>No fidgets registered yet. Press + to add one.</p>";
    return;
  }

  fidgets.forEach(fidget => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${fidget.image}" alt="${fidget.name}">
      <h3>${fidget.name}</h3>
      <p>${fidget.description || "No description added."}</p>
      <p><strong>Color:</strong> ${fidget.color || "Not added"}</p>
      <p><strong>Size:</strong> ${fidget.size || "Not added"}</p>
      <p><strong>Rarity:</strong> ${fidget.rarity}</p>
      <p><strong>Status:</strong> ${fidget.status}</p>
      <p><strong>Estimated value:</strong> ${fidget.value}</p>
      <span class="badge ${fidget.traded ? "traded" : ""}">
        ${fidget.traded ? "TRADED" : "AVAILABLE"}
      </span>

      <div class="card-buttons">
        <button class="trade-btn" onclick="markTraded(${fidget.id})">
          ${fidget.traded ? "Available" : "Traded"}
        </button>
        <button class="delete-btn" onclick="deleteFidget(${fidget.id})">
          Delete
        </button>
      </div>
    `;

    fidgetList.appendChild(card);
  });
}

function markTraded(id) {
  fidgets = fidgets.map(fidget => {
    if (fidget.id === id) {
      fidget.traded = !fidget.traded;
    }
    return fidget;
  });

  saveFidgets();
  renderFidgets();
}

function deleteFidget(id) {
  const sure = confirm("Are you sure you want to delete this fidget?");
  if (!sure) return;

  fidgets = fidgets.filter(fidget => fidget.id !== id);
  saveFidgets();
  renderFidgets();
}

renderFidgets();
