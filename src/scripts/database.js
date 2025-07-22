import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = {
    apiKey: "AIzaSyCPC6aCEzTydqiDvXtXQ8S67ZxDuseCrdk",
    authDomain: "final-3cf98.firebaseapp.com",
    projectId: "final-3cf98",
    storageBucket: "final-3cf98.firebasestorage.app",
    messagingSenderId: "540018380553",
    appId: "1:540018380553:web:9ec2fd28769cf4e6fb4dd8"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export async function fetchPrivateDocumentById(user) {
    if (!user) {
        console.error("Authentication required to fetch private document.");
        return null;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        console.log(userDoc.data());

        if (userDoc.exists()) {
            console.log(`Fetched private document for user ${user.uid}.`);
            return userDoc.data();
        } else {
            console.log(`Private document for user ${user.uid}.`);
            return null;
        }
    }
    catch (error) {
        console.error("Error fetching private document:", error);
        return null;
    }
}

export async function updatePrivateDocument(user, data) {
    if (!user) {
        console.error("Authentication required to update private document.");
        return false;
    }

    try {
        await updateDoc(doc(db, "users", user.uid), data);
        console.log(`Document updated in private collection for user ${user.uid}.`);
        return true;
    } catch (error) {
        console.error(`Error updating document  in private collection: ${error}`);
        return false;
    }
}