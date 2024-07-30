let activeTabId;

chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed");
	chrome.contextMenus.create(
		{
			id: "openInFrame",
			title: "PixelBin.io",
			contexts: ["editable", "image"],
		},
		() => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
			} else {
				console.log("Context menu created");
			}
		}
	);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "openInFrame") {
		activeTabId = tab.id;

		chrome.windows.create(
			{
				url: "./src/mediaLibrary/popup.html",
				type: "popup",
				width: 800,
				height: 600,
			},
			() => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
				}
			}
		);
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "getActiveTabId") {
		sendResponse({ activeTabId });
	} else if (message.type === "openMenu") {
		chrome.windows.create(
			{
				url: `./src/contextMenu/popup.html?imageUrl=${encodeURIComponent(
					message.imageUrl
				)}`,
				type: "popup",
				width: 800,
				height: 600,
			},
			() => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
				}
			}
		);
	}
});
