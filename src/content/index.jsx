import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import logo from "../../public/pixb_logo.png";
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

	const handleMenuItemClick = (event, item) => {
		event.stopPropagation();
		event.preventDefault();

		let url;
		switch (item) {
			case "PixelBin.io":
				url = encodeURI(
					`https://console.pixelbinz0.de/choose-org?redirectTo=chrome-ext?external_url=${imageData.src}`
				);
				break;
			case "Erase.bg":
				url = encodeURI(`https://www.erasez0.de/upload?url=${imageData.src}`);
				break;
			case "WatermarkRemover.io":
				url = encodeURI(
					`https://www.watermarkremoverz0.de/upload?url=${imageData.src}`
				);
				break;
			case "Shrink.media":
				url = encodeURI(`https://www.shrinkz0.de/upload?url=${imageData.src}`);
				break;
			case "Upscale.media":
				url = encodeURI(`https://www.upscalez0.de/upload?url=${imageData.src}`);
				break;
			default:
				break;
		}

		if (url) {
			window.open(url, "_blank");
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
				src={logo}
				alt="PixelBin AI Icon"
				className="pce-context-logo"
				style={{ width: "24px", height: "24px", cursor: "pointer" }}
			/>
			{isModalVisible && (
				<div className="pce-context-modal" ref={modalRef}>
					<div
						className="pce-menu-item"
						onClick={(e) => handleMenuItemClick(e, "PixelBin.io")}
					>
						PixelBin.io
					</div>
					<div
						className="pce-menu-item"
						onClick={(e) => handleMenuItemClick(e, "Erase.bg")}
					>
						Erase.bg
					</div>
					<div
						className="pce-menu-item"
						onClick={(e) => handleMenuItemClick(e, "WatermarkRemover.io")}
					>
						WatermarkRemover.io
					</div>
					<div
						className="pce-menu-item"
						onClick={(e) => handleMenuItemClick(e, "Upscale.media")}
					>
						Upscale.media
					</div>
					<div
						className="pce-menu-item"
						onClick={(e) => handleMenuItemClick(e, "Shrink.media")}
					>
						Shrink.media
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
		if (!img.parentElement.querySelector("#pce-react-container")) {
			const reactContainer = document.createElement("div");
			reactContainer.id = "pce-react-container";
			reactContainer.style.position = "absolute";
			reactContainer.style.height = "100%";
			reactContainer.style.width = "100%";
			reactContainer.style.top = "0";
			reactContainer.style.left = "0";
			reactContainer.style.zIndex = "999999"; // Increase z-index

			// img.style.position = "relative";
			// img.parentElement.style.position = "relative";
			img.parentElement.appendChild(reactContainer);

			const imageData = {
				src: img.src,
				alt: img.alt,
				width: img.width,
				height: img.height,
				AllData: img,
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
