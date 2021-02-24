const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static(__dirname + "/public"));

const server = require("http").createServer(app);

const puppeteer = require("puppeteer");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/template.html");
});

// export final PNG
app.post("/save", function (req, res) {
  const dataUrl = req.body.dataUrl;
  const base64Data = dataUrl.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  fs.writeFile("./test.png", base64Data, "base64", (err) => {
    console.log(err);
  });

  res.json({ status: "success" });
});

/*
 const fabricJSON = JSON.parse(
    `{"version":"4.3.1","objects":[{"type":"image","version":"4.3.1","originX":"left","originY":"top","left":0,"top":0,"width":2810,"height":2592,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":0.11,"scaleY":0.11,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"circle","version":"4.3.1","originX":"center","originY":"center","left":0,"top":0,"width":600,"height":600,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":300,"startAngle":0,"endAngle":6.283185307179586,"inverted":false,"absolutePositioned":true},"cropX":0,"cropY":0,"src":"http://localhost:1234/dog.03a7048a.jpg","crossOrigin":null,"filters":[]}]}`
  );
*/

// rendering
app.post("/render", async function (req, res) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // open template.html
  await page.goto("http://localhost:3000");

  const fabricJSON = req.body;

  try {
    await page.evaluate((json) => {
      renderCanvasFromJSON(json);
    }, fabricJSON);

    console.log("render job dispatched");
  } catch (e) {
    console.log(e);
  }

  //browser.close();
  res.end();
});

server.listen(3000, () => {
  console.log("Listen 3000");
});
