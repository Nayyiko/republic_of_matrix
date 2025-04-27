document.body.classList.add("light-theme");

document.getElementById("theme-toggle").addEventListener("click", () => {
	document.body.classList.toggle("dark-theme");
	document.body.classList.toggle("light-theme");
});

// Duplicate cards for infinite scroll loop
const track = document.getElementById("cards-track");
track.innerHTML += track.innerHTML;
