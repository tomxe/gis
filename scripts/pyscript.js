function getToken() {
  return "pk.eyJ1IjoiYnJpY2tlciIsImEiOiJULVRnSlZZIn0.LHt8a4ByC-_b4ytgeh7H5Q";
}

function getMap() {
  return map;
}

function updateCorners(jsonData) {
  let data = JSON.parse(jsonData);
  for (let i = 0; i < data.features.length; i++) {
    let screenCoords = data.features[i].geometry.coordinates;
    let point = new mapboxgl.Point(screenCoords[0], screenCoords[1]);
    let geoCoords = map.unproject(point);
    data.features[i].geometry.coordinates = [geoCoords.lng, geoCoords.lat];
  }
  map.getSource("corners").setData(data);
}

function updateImage(src) {
  let bounds = map.getBounds();
  map.getSource("edges").updateImage({
    url: src,
    coordinates: [
      [bounds._sw.lng, bounds._ne.lat],
      [bounds._ne.lng, bounds._ne.lat],
      [bounds._ne.lng, bounds._sw.lat],
      [bounds._sw.lng, bounds._sw.lat],
    ],
  });
}

mapboxgl.accessToken = getToken();
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v9",
  center: [-69.95, 12.5],
  zoom: 11,
});

map.on("load", () => {
  const layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style.
  let firstSymbolId;
  for (const layer of layers) {
    if (layer.type === "symbol") {
      firstSymbolId = layer.id;
      break;
    }
  }

  map.addSource("corners", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });
  map.addLayer(
    {
      id: "corners",
      type: "circle",
      source: "corners",
      paint: {
        "circle-radius": 4,
        "circle-color": "#ffaa00",
      },
    },
    firstSymbolId
  );

  map.addSource("edges", {
    type: "image",
    url: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    coordinates: [
      [-70.02, 12.616],
      [-69.5, 12.616],
      [-69.5, 12.4],
      [-70.02, 12.4],
    ],
  });
  map.addLayer(
    {
      id: "edges",
      type: "raster",
      source: "edges",
      paint: {
        "raster-fade-duration": 1000,
      },
    },
    "corners"
  );
});
