# PixelBin.io Chrome Extension

## Uses

Pixelbin chrome extension have two major use cases for user

1. When user hover over any image, **`PixelBin.io`**'s logo appears as a clickable icon. Clicking it allows you to transform the hovered image using PixelBin.io or apply any available free  property.

2. Right-clicking inside any text input shows a **`PixelBin.io`** option. Selecting it opens an iframe with PixelBin.io's storage page, allowing users to insert image URLs or perform other storage-related actions directly in the input field.

## Installation

1. In chrome on top right corner click on puzzle icon and then click on chrome webstore option.

2. In chrome web store search for **`PixelBin.io`** and click on add to chrome.

## Project Structure

- **`manifest.json`** : It posses all the details and permissions for the content access in chrome and host permissions.

- **`Service worker`** : background/index.js is a service worker and adds PixelBin.io`s option in context menu.

- **`Content File`** : content/index.js have all the code for image hovering action which basically edits the content on current page in chrome.

- **`Media Library`** : Contains all the details required for opeining the iframe using media library package.

## Development Process

**Clone Repository**:

    git clone https://github.com/pixelbin-io/chrome-extension

**Install Dependencies**:

    npm install

**Build the Plugin**:

    npm run build

**Add to Chrome**:

- In Chrome, click on the puzzle icon in the top right.
- Click on load unpacked and select the dist folder from extension's folder directory. 