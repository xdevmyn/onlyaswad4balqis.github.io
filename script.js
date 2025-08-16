// Simple hash-router so each section behaves like a page
const routes = ["home", "hosts", "details", "gallery", "rsvp"];
const app = document.getElementById("app");
const audio = document.getElementById("bg-audio");
const gate = document.getElementById("gate");
const enterBtn = document.getElementById("enter-btn");
const audioToggle = document.getElementById("audio-toggle");
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

// Activate correct "page"
function showRoute(hash) {
  const id = (hash || "#home").replace("#", "");
  document.querySelectorAll(".page").forEach(sec => sec.classList.remove("page-active"));
  const targetId = routes.includes(id) ? id : "home";
  document.getElementById(targetId).classList.add("page-active");
  // Smooth scroll to top of main
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.addEventListener("hashchange", () => showRoute(location.hash));
document.querySelectorAll("[data-route]").forEach(a => {
  a.addEventListener("click", () => setTimeout(() => showRoute(location.hash), 0));
});
showRoute(location.hash);

// Gate / Audio handling (autoplay policies require a user gesture)
let audioAllowed = false;
enterBtn.addEventListener("click", async () => {
  gate.style.opacity = "0";
  setTimeout(() => (gate.style.display = "none"), 300);
  try {
    await audio.play();
    audioAllowed = true;
    audioToggle.setAttribute("data-on", "1");
  } catch (e) {
    audioAllowed = false;
  }
});

// Audio toggle
audioToggle.addEventListener("click", async () => {
  if (!audioAllowed) {
    try { await audio.play(); audioAllowed = true; } catch(e) {}
  } else {
    if (audio.paused) { audio.play(); } else { audio.pause(); }
  }
  audioToggle.classList.toggle("muted", audio.paused);
});

// RSVP (demo-only; replace with your backend or Formspree if needed)
const rsvpForm = document.getElementById("rsvp-form");
const statusEl = document.getElementById("form-status");
rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(rsvpForm).entries());
  // Demo: save to localStorage
  const all = JSON.parse(localStorage.getItem("rsvps") || "[]");
  all.push({ ...data, ts: Date.now() });
  localStorage.setItem("rsvps", JSON.stringify(all));
  statusEl.textContent = "Thank you — your RSVP has been recorded.";
  rsvpForm.reset();
  setTimeout(() => (statusEl.textContent = ""), 4000);
});

// Subtle floating gold particles for luxe feel
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let w, h, particles;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function initParticles() {
  const count = Math.min(80, Math.floor(w * h / 25000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.6,
    a: Math.random() * Math.PI * 2,
    s: Math.random() * 0.4 + 0.2
  }));
}
initParticles();

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    p.a += 0.004 + p.s * 0.002;
    p.x += Math.cos(p.a) * p.s;
    p.y += Math.sin(p.a) * p.s * 0.8;
    if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
    if (p.y < -5) p.y = h + 5; if (p.y > h + 5) p.y = -5;

    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
    grd.addColorStop(0, "rgba(233,200,90,.9)");
    grd.addColorStop(1, "rgba(233,200,90,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();
