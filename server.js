import fs from "fs";
import util from "util";
import path from "path";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";

import https from "https";
import express from "express";
import cors from "cors";
import compression from "compression";

const __dirname = path.resolve();
const writeFileAsync = util.promisify(fs.writeFile);

import { setVisitor } from "./utils.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrSNn0x-C5VIKVyP4DKS8soMrbnH90zSw",
  authDomain: "eticmobile-24b6e.firebaseapp.com",
  projectId: "eticmobile-24b6e",
  storageBucket: "eticmobile-24b6e.appspot.com",
  messagingSenderId: "317745299408",
  appId: "1:317745299408:web:ee58f77844b2f83c5983d5",
};
// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const database = getFirestore(firebase_app);
const storage = getStorage();

const PORT = 443;
let APP_DATA = null;

const app = express();

app.use(compression());
app.use(cors());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  setVisitor(req.socket.remoteAddress);
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/data", async (req, res) => {
  if (!APP_DATA) {
    APP_DATA = await reset();
  }
  res.json(APP_DATA);
});
app.get("/reset", async (req, res) => {
  APP_DATA = await reset();
  res.json(APP_DATA);
});
app.get("/seek_stream/:url", async (req, res) => {
  const url_to_seek = req.params.url;
  console.log(url_to_seek);
});

const options = {
  key: fs.readFileSync("/app/privkey.pem"),
  cert: fs.readFileSync("/app/fullchain.pem"),
};

https.createServer(options, app).listen(PORT, () => {
  try {
    let rawdata = fs.readFileSync("public/app_data.json");
    APP_DATA = JSON.parse(rawdata);
  } catch (error) {
    console.error("Error", error);
  }
  console.log("Server listening on port 443");
});
// app.listen(PORT, async () => {
//   try {
//     let rawdata = fs.readFileSync("public/app_data.json");
//     APP_DATA = JSON.parse(rawdata);
//   } catch (error) {
//     console.error("Error", error);
//   }
//   console.log(`Server listening on port ${PORT}`);
// });

const reset = async () => {
  const radios = await getRadios();
  const music = await getMusic(ref(storage, ""));
  const dataOut = [
    {
      id: "radios",
      type: "folder",
      name: "radios",
      children: radios,
    },
    {
      id: "music",
      type: "folder",
      name: "music",
      children: music.children,
    },
  ];

  try {
    const publicDirPath = path.join(__dirname, "public");
    const filePath = path.join(publicDirPath, "/app_data.json");
    await writeFileAsync(filePath, JSON.stringify(dataOut));
    return dataOut;
  } catch (error) {
    return [{ error: error }];
  }
};
//API Firebase
const getRadios = async () => {
  const querySnapshot = await getDocs(collection(database, "music"));
  const radios = [];
  querySnapshot.forEach((doc) => {
    radios.push({ ...doc.data(), id: `radios/${doc.data().name}`, type: "radio" });
  });
  return radios;
};
const getMusic = async (ref) => {
  let resultObj = {
    children: [],
  };
  const result = await listAll(ref);
  const itemsPromises = result.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const itemID = itemRef.fullPath.split("/");
    itemID.pop();
    resultObj.children.push({
      id: `music/${itemRef.fullPath}`,
      type: "music",
      name: itemRef.name.replace(".mp3", ""),
      url: url,
    });
  });
  const prefixesPromises = result.prefixes.map(async (subfolderRef) => {
    const subfolderObj = await getMusic(subfolderRef);
    const deconstruct = subfolderRef.fullPath.split("/");
    resultObj.children.push({
      id: `music/${subfolderRef.fullPath}`,
      type: "folder",
      name: deconstruct[deconstruct.length - 1],
      children: subfolderObj.children.length > 0 ? subfolderObj.children : subfolderObj,
    });
  });

  await Promise.all([...itemsPromises, ...prefixesPromises]);
  return resultObj;
};
