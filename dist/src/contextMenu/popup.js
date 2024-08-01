document.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const imageUrl = params.get("imageUrl");
	document.getElementById("image-url").textContent = imageUrl;
	// Add more code to handle the menu functionalities
});
