import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";
import { config } from "./config.js";

//API Firebase
const firebase_app = initializeApp(config);
const database = getFirestore(firebase_app);
const storage = getStorage();

export const reset_firebase = async () => {
  const radios = await getRadios();
  const music = await getMusic(ref(storage, ""));
  return {
    radios: radios,
    music: music.children,
  };
};
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
