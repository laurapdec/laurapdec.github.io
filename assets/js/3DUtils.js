
const modelViewerParameters = document.querySelector("model-viewer#engineF1");

modelViewerParameters.addEventListener("load", (ev) => {

  let material = modelViewerParameters.model.materials[0];

  material.pbrMetallicRoughness.setMetallicFactor(0.7);
  material.pbrMetallicRoughness.setRoughnessFactor(0.3);
  // Defaults to gold
  material.pbrMetallicRoughness.setBaseColorFactor([0.8,0.8,0.8,0.1]);

});

