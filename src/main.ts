import { Event } from "./models/Event.js";
import { User } from "./models/User.js";
import { Registration } from "./models/Registration.js";


let events: Event[] = [];
let registrations: Registration[] = [];


const eventForm = document.getElementById("eventForm") as HTMLFormElement;
const eventsList = document.getElementById("events") as HTMLUListElement;
const registrationForm = document.getElementById("registrationForm") as HTMLFormElement;
const eventSelect = document.getElementById("eventSelect") as HTMLSelectElement;
const registrationsList = document.getElementById("registrations") as HTMLUListElement;
const detailsContainer = document.getElementById("details-container") as HTMLDivElement;
const searchInput = document.getElementById("searchEvent") as HTMLInputElement;
const feedbackContainer = document.getElementById("feedback") as HTMLDivElement;


const sortByDateBtn = document.getElementById("sortByDate") as HTMLButtonElement | null;
const sortByCategoryBtn = document.getElementById("sortByCategory") as HTMLButtonElement | null;
const sortByTitleBtn = document.getElementById("sortByTitle") as HTMLButtonElement | null;


let currentPage: string = "home";

function showPage(pageId: string) {
  document.querySelectorAll(".page").forEach(page => {
    (page as HTMLElement).classList.remove("active");
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("active");
    currentPage = pageId;
    if (pageId === "details") renderDetails();
  }
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    const pageId = (btn as HTMLButtonElement).dataset.page!;
    showPage(pageId);
  });
});


function renderEvents() {
  eventsList.innerHTML = "";
  events.forEach(ev => {
    const li = document.createElement("li");
    li.textContent = `${ev.title} - ${ev.date.toLocaleDateString()} - ${ev.location} [${ev.category}]`;
    eventsList.appendChild(li);
  });
}


function renderDetails(filteredEvents?: Event[]) {
  detailsContainer.innerHTML = "";
  const listToRender = filteredEvents ?? events;

  const counter = document.createElement("p");
  counter.textContent = `${listToRender.length} évènement(s) trouvé(s)`;
  detailsContainer.appendChild(counter);

  if (listToRender.length === 0) {
    detailsContainer.innerHTML += "<p>Aucun évènement trouvé.</p>";
    return;
  }

  const ul = document.createElement("ul");
  listToRender.forEach(ev => {
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
}

function updateEventSelect() {
  eventSelect.innerHTML = "";
  events.forEach((ev, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = ev.title;
    eventSelect.appendChild(option);
  });
}


function renderRegistrations() {
  registrationsList.innerHTML = "";
  registrations.forEach(reg => {
    const li = document.createElement("li");
    li.textContent = `${reg.user.name} (${reg.user.email}) inscrit à ${reg.event.title}`;
    registrationsList.appendChild(li);
  });
}


function showFeedback(message: string, type: "success" | "error") {
  feedbackContainer.innerHTML = "";
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.className = type;
  feedbackContainer.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}


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
  renderEvents();
  updateEventSelect();
  if (currentPage === "details") renderDetails();
  eventForm.reset();
});


registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = (document.getElementById("userName") as HTMLInputElement).value.trim();
  const email = (document.getElementById("userEmail") as HTMLInputElement).value.trim();
  const eventIndex = parseInt(eventSelect.value, 10);

  const user = new User(name, email);
  const event = events[eventIndex];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate < today) {
    showFeedback(" Impossible de s'inscrire : l'évènement est déjà passé.", "error");
    return;
  }

 
  if (event.capacity <= 0) {
    showFeedback(" Capacité atteinte pour cet évènement.", "error");
    return;
  }

  
  const alreadyRegistered = registrations.some(
    reg => reg.event === event && reg.user.email.toLowerCase() === email.toLowerCase()
  );
  if (alreadyRegistered) {
    showFeedback(" Vous êtes déjà inscrit à cet évènement.", "error");
    return;
  }

  
  const newRegistration = new Registration(user, event);
  registrations.push(newRegistration);

  
  event.capacity = event.capacity - 1;

  renderRegistrations();
  if (currentPage === "details") renderDetails();
  registrationForm.reset();
  showFeedback(" Inscription réussie !", "success");
});


sortByDateBtn?.addEventListener("click", () => {
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  renderDetails();
});
sortByCategoryBtn?.addEventListener("click", () => {
  events.sort((a, b) => a.category.localeCompare(b.category));
  renderDetails();
});
sortByTitleBtn?.addEventListener("click", () => {
  events.sort((a, b) => a.title.localeCompare(b.title));
  renderDetails();
});


searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(query) ||
    ev.location.toLowerCase().includes(query) ||
    ev.category.toLowerCase().includes(query)
  );
  renderDetails(filtered);
});

const toggleThemeBtn = document.getElementById("toggleTheme") as HTMLButtonElement;
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleThemeBtn.textContent = document.body.classList.contains("dark")
    ? " Mode clair"
    : " Mode sombre";
});



showPage("home");
console.log(" Script chargé et prêt !");
