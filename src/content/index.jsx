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
		url: "https://console.pixelbinz0.de?utm_source=chrome&utm_medium=plugin&utm_campaign=pixelbinio/choose-org&redirectTo=chrome-ext",
		displayName: "Edit Image",
		logo: PbLogo,
		utmParams: "",
		imgParamName: "?external_url=",
	},
	{
		name: "Erase.bg",
		url: "https://www.erase.bg/upload",
		displayName: "Remove Background",
		logo: ebgLogo,
		utmParams: "?utm_source=chrome&utm_medium=plugin&utm_campaign=erasebg",
		imgParamName: "&url=",
	},
	{
		name: "WatermarkRemover.io",
		url: "https://www.watermarkremover.io/upload",
		displayName: "Remove Watermark",
		logo: wmrLogo,
		utmParams:
			"?utm_source=chrome&utm_medium=plugin&utm_campaign=watermarkremoverio",
		imgParamName: "&url=",
	},
	{
		name: "Upscale.media",
		url: "https://www.upscale.media/upload",
		displayName: "Upscale Image",
		logo: umLogo,
		utmParams: "?utm_source=chrome&utm_medium=plugin&utm_campaign=upscalemedia",
		imgParamName: "&url=",
	},
	{
		name: "Shrink.media",
		url: "https://www.shrink.media/upload",
		displayName: "Image Optimise",
		logo: smLogo,
		utmParams: "?utm_source=chrome&utm_medium=plugin&utm_campaign=shrinkmedia",
		imgParamName: "&url=",
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

	const handleMenuItemClick = async (event, name) => {
		event.stopPropagation();
		event.preventDefault();
		setIsModalVisible(false);
		let imageURL = "";
		// On prod we will require real time API key for this
		const YOUR_PIXELBIN_API_KEY = btoa("fa6701e2-5377-44b7-94b2-dd0b58e59730");
		// Function to convert base64 string to Blob
		function base64ToBlob(base64String, mimeType = "") {
			const byteCharacters = atob(base64String.split(",")[1]); // Decode base64 string
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			return new Blob([byteArray], { type: mimeType });
		}

		// Function to upload the file to PixelBin using Fetch API
		async function uploadImage(formData) {
			const response = await fetch(
				"https://api.pixelbinz0.de/service/platform/assets/v1.0/upload/direct",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${YOUR_PIXELBIN_API_KEY}`, // Replace with your actual PixelBin API key
					},
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			return await response.json();
		}

		async function init(base64String) {
			try {
				// Convert the base64 string to Blob
				const blob = base64ToBlob(base64String, "image/jpeg"); // Adjust MIME type if necessary

				// Prepare the FormData
				const formData = new FormData();
				formData.append("file", blob, "image.png"); // Append blob to the form data
				formData.append("filenameOverride", true);

				// Call the PixelBin API to upload the file
				const uploadResponse = await uploadImage(formData);

				console.log("Upload Response:", uploadResponse);
				imageURL = await uploadResponse?.url;
			} catch (error) {
				console.error("Upload failed:", error);
			}
		}

		let foundIndex = menuItems.findIndex((item) => item.name === name);

		if (imageData.src.includes("base64")) {
			const size = new Blob([imageData.src]).size / (1024 * 1024);
			if (size > 4.9) {
				alert("Image too large");
				return;
			}
			await init(imageData.src);
		} else {
			imageURL = imageData.src;
		}

		let url =
			menuItems[foundIndex].url +
			menuItems[foundIndex].utmParams +
			menuItems[foundIndex].imgParamName +
			imageURL;

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

let currentReactContainer = null;

document.addEventListener("mouseover", (event) => {
	const img = event.target;

	if (img.tagName === "IMG" && img.width > 50 && img.height > 50) {
		if (
			location.hostname.includes("pixelbin") ||
			location.hostname.includes("erase") ||
			location.hostname.includes("watermark") ||
			location.hostname.includes("shrink") ||
			location.hostname.includes("upscale")
		) {
			return;
		}

		if (disabledSites?.includes(location.hostname)) return;

		// Remove the previous reactContainer if it exists
		if (currentReactContainer) {
			currentReactContainer?.parentElement?.removeChild(currentReactContainer);
			currentReactContainer = null;
		}

		if (!img.parentElement.querySelector("#pce-react-container")) {
			const reactContainer = document.createElement("div");
			reactContainer.id = "pce-react-container";
			reactContainer.style.position = "absolute";
			reactContainer.style.height = "32px";
			reactContainer.style.width = "38px";
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

			const positionReactContainer = () => {
				const top = img.offsetTop + img.height - 32;
				const left = img.offsetLeft + img.width - 32; // Relative to parent

				// Apply the calculated top and left positions
				reactContainer.style.top = `${top}px`;
				reactContainer.style.left = `${left}px`;
			};

			// Initial positioning
			positionReactContainer();

			// Re-position the container when the window is resized or scrolled
			window.addEventListener("resize", positionReactContainer);
			window.addEventListener("scroll", positionReactContainer);

			img.addEventListener("mouseenter", (e) => {
				if (!reactContainer.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "1";
					reactContainer.style.pointerEvents = "auto";
				}
			});

			img.addEventListener("mouseleave", (e) => {
				if (!reactContainer.contains(e.relatedTarget)) {
					reactContainer.style.opacity = "0";
					reactContainer.style.pointerEvents = "none";
					setTimeout(() => {
						if (!reactContainer.contains(document.activeElement)) {
							reactContainer?.parentElement?.removeChild(reactContainer);
							currentReactContainer = null;
						}
					}, 200); // Delay to ensure the mouse has fully left the element
				}
			});

			// Update the currentReactContainer reference
			currentReactContainer = reactContainer;
		}
	}
});
