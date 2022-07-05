"use strict";

//Event Objects
const inputField = document.querySelector(".inputField");
const textField = document.getElementById("textField");
const submitBtn = document.querySelector(".submitBtn");
const overlay = document.querySelector(".overlay");
const modalClose = document.querySelector(".modalClose");
const modalButton = document.querySelector(".modalButton");
const fig = document.querySelectorAll("figure");

//DOM Elements
const ipAddress = document.querySelector(".ipAddress");
const locationData = document.querySelector(".location");
const timeZone = document.querySelector(".timeZone");
const isp = document.querySelector(".isp");
const mapContainer = document.querySelector(".mapContainer");
const modalWindow = document.querySelector(".modal");
const hidden = document.querySelector(".hidden");

//Leaflet Custom Marker
const customMarker = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [40, 50],
});

//Helper functions
const helper = function () {
  mapContainer.innerHTML = "";
  if (L.DomUtil.get("map") == undefined) {
    mapContainer.insertAdjacentHTML("beforeend", `<div id="map"></div>`);
  }
};

const showModal = function () {
  overlay.classList.remove("hidden");
  modalWindow.classList.remove("hidden");
};

const hideModal = function () {
  overlay.classList.add("hidden");
  modalWindow.classList.add("hidden");
};

//IPify API
const getIPData = async () => {
  helper();
  try {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_5azKAD4YK0mwQNBotQlfpXSZyww2C&ipAddress=${inputField.value}`
    );
    const data = await res.json();
    const { lat } = data.location;
    const { lng } = data.location;
    const coords = [lat, lng];

    //Leaflet Map
    const map = L.map("map").setView(coords, 5);

    const basemaps = {
      StreetView: L.tileLayer(
        "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ),
      Topological: L.tileLayer.wms(
        "http://ows.mundialis.de/services/service?",
        {
          layers: "TOPO-WMS",
        }
      ),
      BaseContrast: L.tileLayer.wms(
        "http://ows.mundialis.de/services/service?",
        {
          layers: "OSM-Overlay-WMS",
        }
      ),
    };

    L.control.layers(basemaps).addTo(map);

    basemaps.StreetView.addTo(map);

    L.marker(coords, { icon: customMarker })
      .bindPopup("you are here")
      .addTo(map);

    return (
      (ipAddress.textContent = data.ip),
      (locationData.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`),
      (timeZone.textContent = `UTC ${data.location.timezone}`),
      (isp.textContent = data.isp)
    );
  } catch (err) {
    alert("Please whitelist this page.");
    console.log(err);
  }
};

//Events;
document.addEventListener("load", getIPData());

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getIPData();
  return;
});

modalButton.addEventListener("click", function () {
  showModal();
});

modalClose.addEventListener("click", function () {
  hideModal();
});
overlay.addEventListener("click", function () {
  hideModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modalWindow.classList.contains("hidden")) {
    hideModal();
  }
});

fig.forEach((element) =>
  element.addEventListener(
    "click",
    (element) => {
      element.preventDefault();
      console.log(element.target.children[0].textContent);
      if (element.target.matches("figure")) {
        inputField.value = element.target.children[0].textContent;
      }
      hideModal();
    },
    { capture: false }
  )
);
