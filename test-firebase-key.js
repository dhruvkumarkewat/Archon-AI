const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig1 = {
  apiKey: "AIzaSyB1mUcIwJIeQ7_rrvz6zRf9LsqnUa80ARE", // Original OCR
  authDomain: "github-ai-5f21a.firebaseapp.com",
};

const firebaseConfig2 = {
  apiKey: "AIzaSyB1mUcIwJIeQ7_rrvz6ZRf9LsqnUa8OARE", // User pasted
  authDomain: "github-ai-5f21a.firebaseapp.com",
};

async function testKey(config, name) {
  try {
    const app = initializeApp(config, name);
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, 'test@test.com', 'password123');
    console.log(name + ' SUCCESS (or email not found, which means key is valid)');
  } catch (e) {
    console.log(name + ' ERROR: ' + e.code + ' - ' + e.message);
  }
}

async function run() {
  await testKey(firebaseConfig1, 'Key1');
  await testKey(firebaseConfig2, 'Key2');
  process.exit(0);
}

run();
