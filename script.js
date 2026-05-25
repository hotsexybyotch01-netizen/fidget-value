const homePage = document.getElementById("homePage");
const uploadPage = document.getElementById("uploadPage");
const plusBtn = document.getElementById("plusBtn");
const backBtn = document.getElementById("backBtn");
const fidgetForm = document.getElementById("fidgetForm");
const newFidgets = document.getElementById("newFidgets");
const trendingFidgets = document.getElementById("trendingFidgets");
const yourSide = document.getElementById("yourSide");
const theirSide = document.getElementById("theirSide");
const loadingBox = document.getElementById("loadingBox");

let fidgets = JSON.parse(localStorage.getItem("fidgetsSaved")) || [];
let tradeYourSide = JSON.parse(localStorage.getItem("tradeYourSide")) || [];
let tradeTheirSide = JSON.parse(localStorage.getItem("tradeTheirSide")) || [];

const trending = [
  { name: "NeeDoh Gumdrop", value: 1.5, note: "Trending branded squishy" },
  { name: "Swedish Fish Squishy", value: 0.9, note: "Branded candy squishy" },
  { name: "Waldo’s / OXXO Squishy", value: 0.6, note: "Common store squishy" },
  { name: "Cheese Squishy", value: 2.5, note: "High value cheese squishy" },
  { name: "Glitter Dumplings", value: 3.0, note: "Legendary glitter squishy" }
];

plusBtn.addEventListener("click", () => {
  homePage.classList.remove("active");
  uploadPage.classList.add("active");
});

backBtn.addEventListener("click", () => {
  uploadPage.classList.remove("active");
  homePage.classList.add("active");
});

function saveAll() {
  localStorage.setItem("fidgetsSaved", JSON.stringify(fidgets));
  localStorage.setItem("tradeYourSide", JSON.stringify(tradeYourSide));
  localStorage.setItem("tradeTheirSide", JSON.stringify(tradeTheirSide));
}

function compressImage(file, callback) {
  const reader = new FileReader();

  reader.onload = function(event) {
    const img = new Image();

    img.onload = function() {
      const canvas = document.createElement("canvas");
      const maxWidth = 600;
      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedImage = canvas.toDataURL("image/jpeg", 0.65);
      callback(compressedImage);
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

fidgetForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const photo = document.getElementById("photoInput").files[0];
  const name = document.getElementById("nameInput").value;
  const value = document.getElementById("valueInput").value;
  const note = document.getElementById("noteInput").value;
  const status = document.getElementById("statusInput").value;

  if (!photo) {
    alert("Please add a picture first.");
    return;
  }

  loadingBox.classList.remove("hidden");

  compressImage(photo, function(imageData) {
    setTimeout(() => {
      const newFidget = {
        id: Date.now(),
        image: imageData,
        name,
        value,
        note,
        status
      };

      fidgets.unshift(newFidget);
      saveAll();

      loadingBox.classList.add("hidden");

      alert(
        "Thank you for uploading!\n\n⚠️ Warning: Lying, scamming, or exaggerating about your fidget can get your account banned.\n\nNew registered fidget: " + name
      );

      fidgetForm.reset();
      uploadPage.classList.remove("active");
      homePage.classList.add("active");
      renderAll();
    }, 900);
  });
});

function renderAll() {
  renderFidgets();
  renderTrending();
  renderTradeBoard();
}

function renderFidgets() {
  newFidgets.innerHTML = "";

  if (fidgets.length === 0) {
    newFidgets.innerHTML = `<div class="emptyBox">No fidgets yet. Tap + to add one.</div>`;
    return;
  }

  fidgets.forEach(fidget => {
    newFidgets.innerHTML += `
      <div class="fidgetCard">
        <img src="${fidget.image}">
        <h3>${fidget.name}</h3>
        <p>${fidget.note || "No notes added."}</p>
        <p><strong>Value:</strong> ${fidget.value}</p>
        <span class="badge">${fidget.status}</span>
        <button class="uploadBtn" onclick="addToYourSide(${fidget.id})">Add to Your Side</button>
        <button class="uploadBtn" onclick="addToTheirSide(${fidget.id})">Add to Their Side</button>
        <button class="deleteBtn" onclick="deleteFidget(${fidget.id})">Delete</button>
      </div>
    `;
  });
}

function renderTrending() {
  trendingFidgets.innerHTML = "";

  trending.forEach(item => {
    trendingFidgets.innerHTML += `
      <div class="fidgetCard">
        <h3>${item.name}</h3>
        <p>${item.note}</p>
        <p><strong>Value:</strong> ${item.value}</p>
        <span class="badge">Trending</span>
      </div>
    `;
  });
}

function renderTradeBoard() {
  yourSide.innerHTML = "";
  theirSide.innerHTML = "";

  if (tradeYourSide.length === 0) {
    yourSide.innerHTML = `<div class="emptyBox">Nothing on your side yet.</div>`;
  }

  if (tradeTheirSide.length === 0) {
    theirSide.innerHTML = `<div class="emptyBox">Nothing on their side yet.</div>`;
  }

  tradeYourSide.forEach(fidget => {
    yourSide.innerHTML += tradeCard(fidget);
  });

  tradeTheirSide.forEach(fidget => {
    theirSide.innerHTML += tradeCard(fidget);
  });
}

function tradeCard(fidget) {
  return `
    <div class="fidgetCard">
      <img src="${fidget.image}">
      <h3>${fidget.name}</h3>
      <p><strong>Value:</strong> ${fidget.value}</p>
    </div>
  `;
}

function addToYourSide(id) {
  const item = fidgets.find(f => f.id === id);
  if (item) {
    tradeYourSide.push(item);
    saveAll();
    renderTradeBoard();
  }
}

function addToTheirSide(id) {
  const item = fidgets.find(f => f.id === id);
  if (item) {
    tradeTheirSide.push(item);
    saveAll();
    renderTradeBoard();
  }
}

function clearTrade() {
  tradeYourSide = [];
  tradeTheirSide = [];
  saveAll();
  renderTradeBoard();
}

function deleteFidget(id) {
  fidgets = fidgets.filter(fidget => fidget.id !== id);
  saveAll();
  renderAll();
}

renderAll();
