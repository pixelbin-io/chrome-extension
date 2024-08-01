document.addEventListener("mouseover", (event) => {
	// Check if the hovered element is an image
	const img = event.target;
	if (
		img.tagName === "IMG" &&
		img.id !== "pixelbin-ai-icon" &&
		img.naturalWidth > 50 &&
		img.naturalHeight > 50
	) {
		// Create the icon container if it doesn't already exist
		if (!img.parentElement.querySelector(".icon-container")) {
			const iconContainer = document.createElement("div");
			iconContainer.classList.add("icon-container");
			iconContainer.style.position = "absolute";
			iconContainer.style.bottom = "10px";
			iconContainer.style.right = "10px";
			iconContainer.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
			iconContainer.style.borderRadius = "8px";
			iconContainer.style.padding = "2px";
			iconContainer.style.paddingTop = "0px";
			iconContainer.style.opacity = "0";
			iconContainer.style.transition = "opacity 0.3s";
			iconContainer.style.zIndex = "100000";

			const icon = document.createElement("img");
			icon.src =
				"https://cdn.pixelbin.io/v2/muddy-lab-41820d/original/pixb_logo_64.png"; // Replace with your icon URL
			icon.id = "pixelbin-ai-icon";
			icon.style.width = "24px";
			icon.style.marginBottom = "-6px";
			icon.style.height = "24px";
			icon.style.cursor = "pointer";
			icon.style.zIndex = "100000";

			iconContainer.appendChild(icon);

			img.style.position = "relative";
			img.parentElement.style.position = "relative";
			img.parentElement.appendChild(iconContainer);

			// Event listener for showing the icon container
			img.parentElement.addEventListener("mouseenter", () => {
				iconContainer.style.opacity = "1";
				iconContainer.style.pointerEvents = "auto";
			});

			// Event listener for hiding the icon container
			img.parentElement.addEventListener("mouseleave", (e) => {
				if (!iconContainer.contains(e.relatedTarget)) {
					iconContainer.style.opacity = "0";
					iconContainer.style.pointerEvents = "none";
				}
			});

			// Prevent the icon container from hiding when hovering over the icon
			iconContainer.addEventListener("mouseleave", (e) => {
				if (!img.parentElement.contains(e.relatedTarget)) {
					iconContainer.style.opacity = "0";
					iconContainer.style.pointerEvents = "none";
				}
			});

			// Click event for the icon
			// icon.addEventListener("click", () => {
			// 	chrome.runtime.sendMessage({ type: "openMenu", imageUrl: img.src });
			// });
		}
	}
});
