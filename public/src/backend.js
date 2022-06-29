// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase. google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfWfH1NKuOw0LV8zsrs1qMZb9GMwTasNY",
  authDomain: "music-player-9d063.firebaseapp.com",
  projectId: "music-player-9d063",
  storageBucket: "music-player-9d063.appspot.com",
  messagingSenderId: "330573243041",
  appId: "1:330573243041:web:fd1c00053e3739f041c6e0",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const getAllData = async (title) => {
  let out = [
    {
      title: title,
      children: [],
    },
  ];

  const streams = await getDB("streams");

  const childrenRef = out[0].children;
  childrenRef.push({
    id: "0",
    title: "streams",
    path: "streams",
    children: streams.children,
  });
  childrenRef.push({
    id: "1",
    title: "music",
    path: "music",
    children: await getFolder("music", "1"),
  });

  childrenRef.push({
    id: "2",
    title: "playlists",
    path: "playlists",
    children: [],
  });
  childrenRef.push({
    id: "3",
    title: "open",
    path: "open",
    icon: "open",
    action: "open",
  });
  childrenRef.push({
    id: "4",
    title: "settings",
    path: "settings",
    icon: "settings",
    action: "settings",
  });
  childrenRef.push({
    id: "5",
    title: "lock",
    path: "lock",
    icon: "lock",
    action: "lock",
  });
  childrenRef.push({
    id: "6",
    title: "exit",
    path: "exit",
    icon: "exit",
    action: "exit",
  });
  return out;
};

export const getDB = async (table) => {
  const db = getFirestore();
  let out = null;
  const snapshot = await getDocs(collection(db, table));
  snapshot.forEach((doc) => (out = doc.data()));
  return out;
};

export const updateDB = async (table, data) => {
  const db = getFirestore();
  let docID = null;

  const snapshot = await getDocs(collection(db, table));
  snapshot.forEach((dc) => (docID = dc.id));

  const docRef = doc(db, table, docID);
  await updateDoc(docRef, { data: [data] });

  return data.type;
};

export const getFolder = async (folder, index = "0") => {
  try {
    const storage = await getStorage();
    const listRef = ref(storage, folder);
    const snapshot = await listAll(listRef);
    if (!snapshot.prefixes.length) return [];

    const seek = async (data, arrOut = [], idx = "0") => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const children = await listAll(item);
        const id = `${idx}.${i}`;
        if (children.prefixes.length) {
          let child = await seek(children.prefixes, [], id);
          arrOut.push({
            id: id,
            title: item.name,
            path: item.fullPath,
            children: child,
          });
        } else if (children.items.length) {
          let links = [];

          for (let j = 0; j < children.items.length; j++) {
            const itm = children.items[j];
            const fileURL = await getDownloadURL(ref(storage, itm.fullPath));
            links.push({
              id: `${id}.${j})`,
              title: itm.name,
              path: itm.fullPath,
              url: fileURL,
              type: folder,
              action: "play",
            });
          }
          arrOut.push({
            id: id,
            title: item.name,
            path: item.fullPath,
            children: links,
          });
        }
      }
      return arrOut;
    };

    const res = await seek(snapshot.prefixes, [], index);
    return res;
  } catch (error) {
    console.log("ERROR:", error);
  }
};
