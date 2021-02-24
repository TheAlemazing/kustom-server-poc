const canvas = new fabric.StaticCanvas("kustom-canvas");

async function renderCanvasFromJSON(json) {
  canvas.loadFromJSON(json, () => {
    canvas.setWidth(2925);
    canvas.setHeight(2050);
    canvas.setZoom(2);

    // rendered
    canvas.renderAll();

    // dataUrl
    const dataUrl = canvas.toDataURL({
      width: 5850,
      height: 4050,
    });

    // save final PNG
    fetch("/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataUrl }),
    });
  });
}
