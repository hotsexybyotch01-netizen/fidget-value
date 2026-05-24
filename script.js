const homePage = document.getElementById("homePage");
const uploadPage = document.getElementById("uploadPage");
const plusBtn = document.getElementById("plusBtn");
const backBtn = document.getElementById("backBtn");
const fidgetForm = document.getElementById("fidgetForm");
const newFidgets = document.getElementById("newFidgets");
const loadingBox = document.getElementById("loadingBox");

let fidgets = JSON.parse(localStorage.getItem("fidgets")) || [];

plusBtn.addEventListener("click", () => {
  homePage.classList.remove("active");
  uploadPage.classList.add("active");
});

backBtn.addEventListener("click", () => {
  uploadPage.classList.remove("active");
  homePage.classList.add("active");
});

fidgetForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const photo = document.getElementById("photoInput").files[0];
  const name = document.getElementById("nameInput").value;
  const note = document.getElementById("noteInput").value;
  const status = document.getElementById("statusInput").value;

  if (!photo) {
    alert("Please add a picture first.");
    return;
  }

  loadingBox.classList.remove("hidden");

  const reader = new FileReader();

  reader.onload = function() {
    setTimeout(() => {
      const newFidget = {
        id: Date.now(),
        image: reader.result,
        name: name,
        note: note,
        status: status
      };

      fidgets.unshift(newFidget);
      localStorage.setItem("fidgets", JSON.stringify(fidgets));

      loadingBox.classList.add("hidden");

      alert(
        "Thank you for uploading!\n\n⚠️ Warning: Lying, scamming, or exaggerating about your fidget can get your account banned.\n\nNew registered fidget: " + name
      );

      fidgetForm.reset();

      uploadPage.classList.remove("active");
      homePage.classList.add("active");

      renderFidgets();
    }, 1200);
  };

  reader.readAsDataURL(photo);
});

function renderFidgets() {
  newFidgets.innerHTML = "";

  if (fidgets.length === 0) {
    newFidgets.innerHTML = `<div class="emptyBox">No fidgets yet. Tap + to add one.</div>`;
    return;
  }

  fidgets.forEach(fidget => {
    const card = document.createElement("div");
    card.className = "fidgetCard";

    card.innerHTML = `
      <img src="${fidget.image}" alt="Fidget photo">
      <h3>${fidget.name}</h3>
      <p>${fidget.note || "No notes added."}</p>
      <span class="badge">${fidget.status}</span>
      <button class="deleteBtn" onclick="deleteFidget(${fidget.id})">Delete</button>
    `;

    newFidgets.appendChild(card);
  });
}

function deleteFidget(id) {
  fidgets = fidgets.filter(fidget => fidget.id !== id);
  localStorage.setItem("fidgets", JSON.stringify(fidgets));
  renderFidgets();
}

renderFidgets();
