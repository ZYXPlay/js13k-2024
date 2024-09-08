export let imageAssets = {};
export let dataAssets = {};

function getUrl(url, base) {
  return new URL(url, base).href;
}

function addGlobal() {
  if (!window.__k) {
    window.__k = {
      u: getUrl,
      i: imageAssets,
      d: dataAssets,
    };
  }
}

export function loadData(index, fnc, params) {
  addGlobal();

  if (dataAssets[index])
    return dataAssets[index];

  dataAssets[index] = fnc(...params);
}

export function loadImage(url) {
  addGlobal();

  return new Promise((resolve, reject) => {
    let image, fullUrl;

    // resolvedUrl = joinPath(imagePath, url);
    if (imageAssets[url])
      return resolve(imageAssets[url]);

    image = new Image();

    image.onload = () => {
      fullUrl = getUrl(url, window.location.href);
      imageAssets[fullUrl] = imageAssets[url] = image;
      // emit('assetLoaded', this, url);
      resolve(image);
    };

    image.onerror = () => {
      reject(
      );
    };

    image.src = url;
  });
}
