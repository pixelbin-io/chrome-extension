import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import mainLogo from "./assets/pixelbin-storage.png";
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
	const [isDsibaleClicked, setIsDiabledClicked] = useState(false);
	const modalRef = useRef();

	chrome.storage.onChanged.addListener((changes, namespace) => {
		if (namespace === "local" && changes.disabledSites) {
			setIsDiabledClicked(true);
		}
	});

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
		setIsModalVisible(!isModalVisible);
	};

	const handleDisableButtonClick = (event) => {
		event.stopPropagation();
		event.preventDefault();
		const currentSite = window.location.hostname;
		// Get the current list of disabled sites from chrome.storage.local
		chrome.storage.local.get(["disabledSites"], (result) => {
			let disabledSites = result.disabledSites || [];
			if (!disabledSites.includes(currentSite)) {
				disabledSites.push(currentSite);
				// Save the updated list back to chrome.storage.local
				chrome.storage.local.set({ disabledSites }, () => {
					console.log("Site disabled: ", currentSite);
				});
			}
		});
		setIsModalVisible(false);
	};

	return (
		<div className="pce-my-extension">
			{isDsableToolTipVisible && !isDsibaleClicked && (
				<div className="pce-disable-tooltip">Disable for this site</div>
			)}
			{isCloseBtnVisible && !isDsibaleClicked && (
				<img
					src={cross}
					className="pce-disable-button"
					onClick={(e) => handleDisableButtonClick(e)}
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
			{!isDsibaleClicked && (
				<img
					onClick={handleIconClick}
					src={mainLogo}
					alt="PixelBin AI Icon"
					className="pce-context-logo"
					onMouseEnter={() => setIsCloseBtnVisible(true)}
					onMouseLeave={() => setIsCloseBtnVisible(false)}
				/>
			)}
			{isModalVisible && !isDsibaleClicked && (
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

let disabledSites = [];
chrome.storage.local.get(["disabledSites"], (result) => {
	disabledSites = result.disabledSites.length ? result.disabledSites : [];
});
chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace === "local" && changes.disabledSites) {
		disabledSites = changes.disabledSites.newValue || [];
	}
});

const setTooltipPosition = () => {
	const button = document.querySelector(".pce-disable-button");
	const tooltip = document.querySelector(".pce-disable-tooltip");

	if (button && tooltip) {
		const buttonRect = button.getBoundingClientRect();

		// Calculate the center position of the button
		const buttonCenterX = buttonRect.left + buttonRect.width / 2;

		// Calculate the tooltip position
		const tooltipWidth = tooltip.offsetWidth;
		const tooltipHeight = tooltip.offsetHeight;

		// Set tooltip to be centered above the button
		tooltip.style.left = `${buttonCenterX - tooltipWidth / 2}px`;
		tooltip.style.top = `${buttonRect.top - tooltipHeight}px`;
	}
};

// Call this function when the button is visible or the tooltip needs to be shown
document
	.querySelector(".pce-disable-button")
	?.addEventListener("mouseenter", () => {
		setTooltipPosition();
		document.querySelector(".pce-disable-tooltip").style.display = "block"; // Show tooltip
	});

document
	.querySelector(".pce-disable-button")
	?.addEventListener("mouseleave", () => {
		document.querySelector(".pce-disable-tooltip").style.display = "none"; // Hide tooltip
	});

document.addEventListener("mouseover", (event) => {
	const img = event.target;
	if (img.tagName === "IMG" && img.width > 50 && img.height > 50) {
		if (
			location.hostname.includes("pixelbin") ||
			location.hostname.includes("erase") ||
			location.hostname.includes("watermark") ||
			location.hostname.includes("shrinkz") ||
			location.hostname.includes("upscale")
		) {
			return;
		}

		if (disabledSites?.includes(location.hostname)) return;

		if (!img.parentElement.querySelector("#pce-react-container")) {
			const reactContainer = document.createElement("div");
			reactContainer.id = "pce-react-container";

			// Set the container’s style to match the image’s style
			reactContainer.style.position = "absolute";
			reactContainer.style.width = `${img.width}px`;
			reactContainer.style.height = `${img.height}px`;
			reactContainer.style.top = `${img.offsetTop}px`;
			reactContainer.style.left = `${img.offsetLeft}px`;
			reactContainer.style.zIndex = "999999";
			reactContainer.style.pointerEvents = "none"; // So it doesn’t block mouse events to the image

			// Append container directly over the image
			img.parentElement.style.position = "relative"; // Make sure parent is positioned relatively
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
