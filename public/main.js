const canvas = new fabric.StaticCanvas("kustom-canvas");

function renderCanvasFromJSON(json) {
  canvas.loadFromJSON(json, () => {
    // rendered
    canvas.renderAll();

    // dataUrl
    const dataUrl = canvas.toDataURL();

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
