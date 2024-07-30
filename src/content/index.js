document.querySelectorAll("img").forEach((img) => {
	// Filter criteria: Exclude images smaller than 50px
	if (img.naturalWidth > 50 && img.naturalHeight > 50) {
		// Create a container for the icon
		const iconContainer = document.createElement("div");
		iconContainer.style.position = "absolute";
		iconContainer.style.bottom = "10px";
		iconContainer.style.right = "10px";
		iconContainer.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // Whitish transparent background
		iconContainer.style.borderRadius = "8px"; // Optional: Add rounded corners
		iconContainer.style.padding = "2px"; // Optional: Add some padding
		iconContainer.style.paddingTop = "0px"; // Optional: Add some padding
		iconContainer.style.opacity = "0"; // Initially hide the container
		iconContainer.style.transition = "opacity 0.3s"; // Smooth transition

		// Create the icon element
		const icon = document.createElement("img");
		icon.src =
			"https://cdn.pixelbin.io/v2/muddy-lab-41820d/original/pixb_logo_64.png";
		icon.style.width = "24px";
		icon.style.marginBottom = "-6px";
		icon.style.height = "24px";
		icon.style.cursor = "pointer";
		iconContainer.appendChild(icon); // Append icon to the container

		// Append the container to the image's parent
		img.style.position = "relative";
		img.parentElement.style.position = "relative";
		img.parentElement.appendChild(iconContainer);

		// Show container on hover
		img.parentElement.addEventListener("mouseenter", () => {
			iconContainer.style.opacity = "1"; // Show the container
			iconContainer.style.pointerEvents = "auto"; // Allow clicking when visible
		});

		img.parentElement.addEventListener("mouseleave", () => {
			iconContainer.style.opacity = "0"; // Hide the container
			iconContainer.style.pointerEvents = "none"; // Prevent clicking when hidden
		});

		// Handle icon click
		icon.addEventListener("click", () => {
			chrome.runtime.sendMessage({ type: "openMenu", imageUrl: img.src });
		});
	}
});
