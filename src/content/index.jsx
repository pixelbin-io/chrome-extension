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
		event.stopPropagation();
		event.preventDefault();

		console.log("Image Data:", imageData);
		console.log("Menu Item Clicked:", item);

		let url;
		switch (item) {
			case "Erase.bg":
				url = "https://www.erase.bg/upload";
				break;
			case "WatermarkRemover.io":
				url = "https://www.watermarkremover.io/upload";
				break;
			case "Shrink.media":
				url = "https://www.shrink.media/upload";
				break;
			case "Upscale.media":
				url = "https://www.upscale.media/upload";
				break;
			default:
				break;
		}

		if (url) {
			window.location.href = url;
		}
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
					<a className="pce-menu-item" href={handleMenuItemClick("Erase.bg")}>
						Erase.bg
					</a>
					<a
						className="pce-menu-item"
						href={handleMenuItemClick("WatermarkRemover.io")}
					>
						WatermarkRemover.io
					</a>
					<a
						className="pce-menu-item"
						href={handleMenuItemClick("Shrink.media")}
					>
						Shrink.media
					</a>
					<a
						className="pce-menu-item"
						href={handleMenuItemClick("Upscale.media")}
					>
						Upscale.media
					</a>
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
			reactContainer.style.height = "100%";
			reactContainer.style.width = "100%";
			reactContainer.style.top = "0";
			reactContainer.style.left = "0";
			reactContainer.style.zIndex = "2147483647"; // Increase z-index

			// img.style.position = "relative";
			// img.parentElement.style.position = "relative";
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
