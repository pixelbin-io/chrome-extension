import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import mainLogo from "../../public/pixb_logo.png";
import PbLogo from "./assets/PixelBin.svg";
import ebgLogo from "./assets/EraseBG.svg";
import smLogo from "./assets/ShrinkMedia.svg";
import umLogo from "./assets/UpscaleMedia.svg";
import wmrLogo from "./assets/WMRemover.svg";
import cross from "./assets/cross_white.png";
import "./style.css";

const menuItems = [
	{
		name: "PixelBin.io",
		url: "https://console.pixelbinz0.de/choose-org?redirectTo=chrome-ext?external_url=",
		displayName: "Edit Image",
		logo: PbLogo,
	},
	{
		name: "Erase.bg",
		url: "https://www.erasez0.de/upload?url=",
		displayName: "Remove Background",
		logo: ebgLogo,
	},
	{
		name: "WatermarkRemover.io",
		url: "https://www.watermarkremoverz0.de/upload?url=",
		displayName: "Remove Watermark",
		logo: wmrLogo,
	},
	{
		name: "Upscale.media",
		url: "https://www.upscalez0.de/upload?url=",
		displayName: "Upscale Image",
		logo: umLogo,
	},
	{
		name: "Shrink.media",
		url: "https://www.shrinkz0.de/upload?url=",
		displayName: "Image Optimise",
		logo: smLogo,
	},
];

function Main({ imageData }) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isCloseBtnVisible, setIsCloseBtnVisible] = useState(false);
	const [isDsableToolTipVisible, setIsDiableToolTipVisible] = useState(false);
	const modalRef = useRef();

	document
		.getElementById("pce-react-container")
		.addEventListener("mouseleave", (e) => {
			setIsModalVisible(false);
		});

	const handleMenuItemClick = (event, name) => {
		event.stopPropagation();
		event.preventDefault();

		let foundIndex = menuItems.findIndex((item) => item.name === name);

		let url = menuItems[foundIndex].url + imageData.src;

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
			{isDsableToolTipVisible && (
				<div className="pce-disable-tooltip">Disable for this site</div>
			)}
			{isCloseBtnVisible && (
				<img
					src={cross}
					className="pce-disable-button"
					onMouseEnter={() => {
						setIsCloseBtnVisible(true);
						setIsDiableToolTipVisible(true);
					}}
					onMouseLeave={() => {
						setIsCloseBtnVisible(false);
						setIsDiableToolTipVisible(false);
					}}
				/>
			)}
			<img
				onClick={handleIconClick}
				src={mainLogo}
				alt="PixelBin AI Icon"
				className="pce-context-logo"
				onMouseEnter={() => setIsCloseBtnVisible(true)}
				onMouseLeave={() => setIsCloseBtnVisible(false)}
			/>
			{isModalVisible && (
				<div className="pce-context-modal" ref={modalRef}>
					{menuItems.map((item) => {
						return (
							<div
								className="pce-menu-item"
								onClick={(e) => handleMenuItemClick(e, item.name)}
							>
								<img src={item.logo} className="pce-menu-item-icon" />
								<div>{item.displayName}</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default Main;

document.addEventListener("mouseover", (event) => {
	if (
		location.hostname.includes("pixelbin") ||
		location.hostname.includes("erase") ||
		location.hostname.includes("watermark") ||
		location.hostname.includes("shrinkz") ||
		location.hostname.includes("upscale")
	) {
		return;
	}

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
			reactContainer.style.zIndex = "999999";

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
