const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const app = express();

const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static(__dirname + "/public"));

const server = require("http").createServer(app);

const puppeteer = require("puppeteer");
const rimraf = require("rimraf");

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

// rendering
app.post("/render", async function (req, res) {
  const browser = await puppeteer.launch({ devtools: false, headless: true });
  const page = await browser.newPage();

  // open template.html
  await page.goto(`http://localhost:${PORT}`);

  const fabricJSON = req.body;
  const formatted = await Promise.all(
    fabricJSON.objects.map(async (item) => {
      if (item.type === "image") {
        const response = await fetch(item.src, { mode: "no-cors" });
        const buffer = await response.buffer();
        return {
          ...item,
          src: `data:image/jpeg;base64, ${buffer.toString("base64")}`,
        };
      }
      return item;
    })
  );

  try {
    await page.evaluate(
      (json) => {
        renderCanvasFromJSON(json);
      },
      { ...fabricJSON, objects: formatted }
    );

    console.log("render job dispatched");
  } catch (e) {
    console.log(e);
  }

  //browser.close();
  res.end();
});

server.listen(PORT, () => {
  console.log("Listen", PORT);
});
