const firebaseConfig = {
  apiKey: "AIzaSyDaYu2RbjkBo9mNHvVr_eKlawQREZZPJic",
  authDomain: "secret-2c73c.firebaseapp.com",
  projectId: "secret-2c73c",
  storageBucket: "secret-2c73c.appspot.com",
  messagingSenderId: "720406944600",
  appId: "1:720406944600:web:6cbf19be8e82b5664d232d"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
