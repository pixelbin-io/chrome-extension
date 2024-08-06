import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./style.css";

function Main({ imageData }) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const modalRef = useRef();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				setIsModalVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [modalRef]);

	const handleMenuItemClick = (item) => {
		console.log("Image Data:", imageData);
		console.log("Menu Item Clicked:", item);
		// Add any additional actions here
	};

	const handleIconClick = (event) => {
		event.stopPropagation();
		event.preventDefault();
		setIsModalVisible(true);
	};

	return (
		<div className="pce-my-extension">
			<img
				onClick={handleIconClick}
				src="https://cdn.pixelbin.io/v2/muddy-lab-41820d/original/pixb_logo_64.png"
				alt="PixelBin AI Icon"
				className="pce-context-logo"
				style={{ width: "24px", height: "24px", cursor: "pointer" }}
			/>
			{isModalVisible && (
				<div className="pce-context-modal" ref={modalRef}>
					<div
						className="pce-menu-item"
						onClick={() => handleMenuItemClick("Erase.bg")}
					>
						Erase.bg
					</div>
					<div
						className="pce-menu-item"
						onClick={() => handleMenuItemClick("WatermarkRemover.io")}
					>
						WatermarkRemover.io
					</div>
					<div
						className="pce-menu-item"
						onClick={() => handleMenuItemClick("Shrink.media")}
					>
						Shrink.media
					</div>
					<div
						className="pce-menu-item"
						onClick={() => handleMenuItemClick("Upscale.media")}
					>
						Upscale.media
					</div>
				</div>
			)}
		</div>
	);
}

export default Main;

document.addEventListener("mouseover", (event) => {
	const img = event.target;
	if (img.tagName === "IMG" && img.width > 50 && img.height > 50) {
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

			const imageData = {
				src: img.src,
				alt: img.alt,
				width: img.width,
				height: img.height,
			};

			ReactDOM.render(<Main imageData={imageData} />, reactContainer);

			img.parentElement.addEventListener("mouseenter", (e) => {
				if (!reactContainer.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "1";
					reactContainer.style.pointerEvents = "auto";
				}
			});

			img.parentElement.addEventListener("mouseleave", (e) => {
				if (!reactContainer.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "0";
					reactContainer.style.pointerEvents = "none";
				}
			});

			reactContainer.addEventListener("mouseleave", (e) => {
				if (!img.parentElement.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "0";
					reactContainer.style.pointerEvents = "none";
				}
			});

			reactContainer.addEventListener("mouseenter", (e) => {
				if (!img.parentElement.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "1";
					reactContainer.style.pointerEvents = "auto";
				}
			});
		}
	}
});
