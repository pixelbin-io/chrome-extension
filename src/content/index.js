const options = {
	root: document.documentElement,
	threshold: 0.25,
};

new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting && entry.target.tagName === "IMG") {
			const img = entry.target;
			if (img.naturalWidth > 50 && img.naturalHeight > 50) {
				const iconContainer = document.createElement("div");
				iconContainer.style.position = "absolute";
				iconContainer.style.bottom = "10px";
				iconContainer.style.right = "10px";
				iconContainer.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
				iconContainer.style.borderRadius = "8px";
				iconContainer.style.padding = "2px";
				iconContainer.style.paddingTop = "0px";
				iconContainer.style.opacity = "0";
				iconContainer.style.transition = "opacity 0.3s";
				iconContainer.style.zIndex = "1000";

				const icon = document.createElement("img");
				icon.src =
					"https://cdn.pixelbin.io/v2/muddy-lab-41820d/original/pixb_logo_64.png";
				icon.style.width = "24px";
				icon.style.marginBottom = "-6px";
				icon.style.height = "24px";
				icon.style.cursor = "pointer";
				icon.style.zIndex = "1000";
				iconContainer.appendChild(icon);

				img.style.position = "relative";
				img.parentElement.style.position = "relative";
				img.parentElement.appendChild(iconContainer);

				img.parentElement.addEventListener("mouseenter", () => {
					iconContainer.style.opacity = "1";
					iconContainer.style.pointerEvents = "auto";
				});

				img.parentElement.addEventListener("mouseleave", () => {
					iconContainer.style.opacity = "0";
					iconContainer.style.pointerEvents = "none";
				});

				icon.addEventListener("click", () => {
					chrome.runtime.sendMessage({ type: "openMenu", imageUrl: img.src });
				});
			}
		}
	});
});

document.querySelectorAll("img").forEach((img) => {
	observer.observe(img);
});
