import React from "react";
import ReactDOM from "react-dom";

function Main() {
	return (
		<div className="my-extension">
			<img
				src="https://cdn.pixelbin.io/v2/muddy-lab-41820d/original/pixb_logo_64.png"
				alt="PixelBin AI Icon"
				style={{ width: "24px", height: "24px", cursor: "pointer" }}
			/>
		</div>
	);
}

document.addEventListener("mouseover", (event) => {
	// Check if the hovered element is an image
	const img = event.target;
	if (
		img.tagName === "IMG" &&
		img.naturalWidth > 50 &&
		img.naturalHeight > 50
	) {
		// Create the React component container if it doesn't already exist
		if (!img.parentElement.querySelector("#react-container")) {
			const reactContainer = document.createElement("div");
			reactContainer.id = "react-container";
			reactContainer.style.position = "absolute";
			reactContainer.style.bottom = "10px";
			reactContainer.style.right = "10px";
			reactContainer.style.zIndex = "100000";

			img.style.position = "relative";
			img.parentElement.style.position = "relative";
			img.parentElement.appendChild(reactContainer);

			// Render the React component into the container
			ReactDOM.render(<Main />, reactContainer);

			// Event listener for showing the React component container
			img.parentElement.addEventListener("mouseenter", () => {
				reactContainer.style.opacity = "1";
				reactContainer.style.pointerEvents = "auto";
			});

			// Event listener for hiding the React component container
			img.parentElement.addEventListener("mouseleave", (e) => {
				if (!reactContainer.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "0";
					reactContainer.style.pointerEvents = "none";
				}
			});

			// Prevent the React component container from hiding when hovering over the icon
			reactContainer.addEventListener("mouseleave", (e) => {
				if (!img.parentElement.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "0";
					reactContainer.style.pointerEvents = "none";
				}
			});
		}
	}
});
