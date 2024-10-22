import "../../node_modules/xyzWidget/dist/bundle.js";

// document.getElementById("open-btn").addEventListener("click", () => {
window.pixelbin.createMediaLibrary(
	{
		dev: true,
		pixelbinURL: "https://console.pixelbinz0.de",
		remove_header: false,
		max_files: "3",
		insert_caption: "Insert",
		inline_container: "#widget_container",
		default_transformations: [[]],
		button_class: "myBtn",
		button_caption: "Select Image or Video",
	},
	{
		insertHandler: function (data) {
			if (data && data.assets) {
				data.assets.forEach((asset) => {
					const url = asset.url;
					console.log("Inserted asset:", JSON.stringify(asset, null, 2));

					chrome.runtime.sendMessage({ type: "getActiveTabId" }, (response) => {
						if (response && response.activeTabId) {
							chrome.scripting
								.executeScript({
									target: { tabId: response.activeTabId },
									func: (url) => {
										const activeElement = document.activeElement;
										if (
											activeElement &&
											activeElement.tagName === "INPUT" &&
											activeElement.type === "text"
										) {
											activeElement.innerHTML += url + "\n"
										} else if (
											activeElement &&
											activeElement.isContentEditable
										) {
											activeElement.innerHTML += url + "\n"; 
										} else {
											alert("Active element is not editable");
										}
									},
									args: [url],
								})
								.catch((error) => {
									console.error("Script injection failed: ", error);
								});
						} else {
							console.error("Could not retrieve active tab ID");
						}
					});
				});
			}
		},
	}
	// document.getElementById("open-btn")
);
// });
