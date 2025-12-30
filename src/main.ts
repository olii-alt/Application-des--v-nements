import { Event } from "./models/Event.js";
import { User } from "./models/User.js";
import { Registration } from "./models/Registration.js";

// Données
let events: Event[] = [];
let registrations: Registration[] = [];

// Éléments
const eventForm = document.getElementById("eventForm") as HTMLFormElement;
const eventsList = document.getElementById("events") as HTMLUListElement;
const registrationForm = document.getElementById("registrationForm") as HTMLFormElement;
const eventSelect = document.getElementById("eventSelect") as HTMLSelectElement;
const registrationsList = document.getElementById("registrations") as HTMLUListElement;
const detailsContainer = document.getElementById("details-container") as HTMLDivElement;

// Boutons tri (dans Détails)
const sortByDateBtn = document.getElementById("sortByDate") as HTMLButtonElement | null;
const sortByCategoryBtn = document.getElementById("sortByCategory") as HTMLButtonElement | null;
const sortByTitleBtn = document.getElementById("sortByTitle") as HTMLButtonElement | null;

// Navigation
let currentPage: string = "home";

function showPage(pageId: string) {
  document.querySelectorAll(".page").forEach(page => {
    (page as HTMLElement).classList.remove("active");
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("active");
    currentPage = pageId;
    console.log("📄 Page affichée :", pageId);
    if (pageId === "details") renderDetails(); // affiche tout de suite
  }
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const pageId = (btn as HTMLButtonElement).dataset.page!;
    showPage(pageId);
  });
});

// Accueil: liste simple
function renderEvents() {
  eventsList.innerHTML = "";
  events.forEach(ev => {
    const li = document.createElement("li");
    li.textContent = `${ev.title} - ${ev.date.toLocaleDateString()} - ${ev.location} [${ev.category}]`;
    eventsList.appendChild(li);
  });
  console.log("📋 Accueil: liste mise à jour:", events.map(e => e.title));
}

// Détails: affiche tous les évènements
function renderDetails() {
  detailsContainer.innerHTML = "";

  if (events.length === 0) {
    detailsContainer.innerHTML = "<p>Aucun évènement créé.</p>";
    
    return;
  }

  const ul = document.createElement("ul");
  events.forEach(ev => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${ev.title}</h3>
      <p><strong>Description :</strong> ${ev.description}</p>
      <p><strong>Date :</strong> ${ev.date.toLocaleDateString()}</p>
      <p><strong>Lieu :</strong> ${ev.location}</p>
      <p><strong>Catégorie :</strong> ${ev.category}</p>
      <p><strong>Capacité :</strong> ${ev.capacity}</p>
    `;
    ul.appendChild(li);
  });

  detailsContainer.appendChild(ul);
  console.log("📋 Détails: évènements affichés:", events.map(e => e.title));
}

// Select des évènements (Inscriptions)
function updateEventSelect() {
  eventSelect.innerHTML = "";
  events.forEach((ev, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = ev.title;
    eventSelect.appendChild(option);
  });
  console.log("🔄 Select évènements mis à jour:", events.map(e => e.title));
}

// Inscriptions: liste
function renderRegistrations() {
  registrationsList.innerHTML = "";
  registrations.forEach(reg => {
    const li = document.createElement("li");
    li.textContent = `${reg.user.name} (${reg.user.email}) inscrit à ${reg.event.title}`;
    registrationsList.appendChild(li);
  });
  console.log("📋 Inscriptions:", registrations.length);
}

// Création évènement
eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = (document.getElementById("title") as HTMLInputElement).value.trim();
  const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
  const dateValue = (document.getElementById("date") as HTMLInputElement).value;
  const location = (document.getElementById("location") as HTMLInputElement).value.trim();
  const category = (document.getElementById("category") as HTMLSelectElement).value;
  const capacity = parseInt((document.getElementById("capacity") as HTMLInputElement).value, 10);

  const date = new Date(dateValue);
  const newEvent = new Event(title, description, date, location, category, capacity);

  events.push(newEvent);
  console.log("📌 Nouvel évènement:", newEvent);

  renderEvents();
  updateEventSelect();

  // Si on est sur Détails, rafraîchir immédiatement
  if (currentPage === "details") {
    renderDetails();
  }

  eventForm.reset();
});

// Inscription
registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = (document.getElementById("userName") as HTMLInputElement).value.trim();
  const email = (document.getElementById("userEmail") as HTMLInputElement).value.trim();
  const eventIndex = parseInt(eventSelect.value, 10);

  const user = new User(name, email);
  const event = events[eventIndex];

  const newRegistration = new Registration(user, event);
  registrations.push(newRegistration);

  console.log("✅ Nouvelle inscription:", newRegistration);

  renderRegistrations();
  registrationForm.reset();
});

// Tri (boutons dans Détails)
sortByDateBtn?.addEventListener("click", () => {
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  console.log("🔎 Tri par date appliqué");
  renderDetails();
});

sortByCategoryBtn?.addEventListener("click", () => {
  events.sort((a, b) => a.category.localeCompare(b.category));
  console.log("🔎 Tri par catégorie appliqué");
  renderDetails();
});

sortByTitleBtn?.addEventListener("click", () => {
  events.sort((a, b) => a.title.localeCompare(b.title));
  console.log("🔎 Tri par titre appliqué");
  renderDetails();
});
const searchInput = document.getElementById("searchEvent") as HTMLInputElement;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(query) ||
    ev.location.toLowerCase().includes(query)
  );
  // Fonction sans paramètre
 // ✔ pas d’argument
 // Fonction avec paramètre
 // ✔ un argument


});

// Page par défaut
showPage("home");
console.log("✅ Script chargé et prêt !");
