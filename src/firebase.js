// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,query,where,orderBy,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC4kxssPthG8x3cuRYVJAhmD02MYvBBTGo",
  authDomain: "auditzy-assignment-react.firebaseapp.com",
  projectId: "auditzy-assignment-react",
  storageBucket: "auditzy-assignment-react.appspot.com",
  messagingSenderId: "152332878046",
  appId: "1:152332878046:web:f16be479b24c829268024f",
  measurementId: "G-7JYTGFKNYE"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };

// Authentication state listener
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Logout function
export const logout = () => {
  return signOut(auth);
};

// Example functions for CRUD operations
export const addProductToFirebase = async (productId, productData) => {
  const collectionRef = collection(db, 'products');
  await addDoc(collectionRef, { id: productId, ...productData });
};

export const updateProductInFirebase = async (productId, updatedProductData) => {
  try {
    console.log('Updating product with custom ID:', productId);

    // Query the collection for the document with your custom ID
    const querySnapshot = await getDocs(query(collection(db, 'products'), where('id', '==', productId)));

    // Check if the document exists
    if (!querySnapshot.empty) {
      // Update the document using updateDoc
      const productRef = querySnapshot.docs[0].ref;
      await updateDoc(productRef, updatedProductData);
      console.log('Product updated successfully in Firestore!');
    } else {
      console.log('Product with custom ID not found.');
    }
  } catch (error) {
    console.error('Error updating product in Firestore:', error);
    throw error;
  }
};


export const deleteProductFromFirebase = async (productId) => {
  try {
    console.log('Deleting product with custom ID:', productId);

    // Query the collection for the document with your custom ID
    const querySnapshot = await getDocs(query(collection(db, 'products'), where('id', '==', productId)));

    // Check if the document exists
    if (!querySnapshot.empty) {
      // Delete the document using deleteDoc
      const productRef = querySnapshot.docs[0].ref;
      await deleteDoc(productRef);
      console.log('Product deleted successfully.');
    } else {
      console.log('Product with custom ID not found.');
    }
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    throw error;
  }
};





export const getProductsFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('id')));

    const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    return { id: userSnapshot.id, ...userSnapshot.data() };
  } else {
    return null;
  }
};
