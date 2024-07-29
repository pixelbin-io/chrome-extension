chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("RUNNING CONTENT", request);
	if (request.url) {
		const activeElement = document.activeElement;
		if (
			activeElement &&
			activeElement.tagName === "INPUT" &&
			activeElement.type === "text"
		) {
			activeElement.value = request.url;
		} else {
			// For other editable elements like textareas or contenteditable divs
			activeElement.innerHTML = request.url;
		}
	}
});
