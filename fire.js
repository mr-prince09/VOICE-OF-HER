import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXO7gQjpaoWXc_N6xkF1fiydSxCZXvSIM",
  authDomain: "voice-of-women-619c8.firebaseapp.com",
  databaseURL: "https://voice-of-women-619c8-default-rtdb.firebaseio.com",
  projectId: "voice-of-women-619c8",
  storageBucket: "voice-of-women-619c8.appspot.com",
  messagingSenderId: "232824715295",
  appId: "1:232824715295:web:608498a918f2bbe11e7d2a",
  measurementId: "G-0SBDJYE9KK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("Firebase initialized:", app);
console.log("Database initialized:", database);

// Function to add user to Firebase
export function addUser(aadhar, password) {
  if (!aadhar || !password) {
    alert("Aadhar Number and Password are required.");
    return;
  }
  set(ref(database, `users/${aadhar}`), {
    password: password,
    timestamp: new Date().toISOString(),
  })
    .then(() => {
      console.log("User added successfully!");
    })
    .catch((error) => {
      console.error("Error adding user:", error);
    });
}

// Send location to database
export function sendLocationToDatabase(userId, latitude, longitude) {
  // Try to get the user's name from localStorage, fallback to userId if not found
  const userName = localStorage.getItem("userName") || userId || "guest";
  const locationRef = ref(database, `sos-locations/${userName}/location`);
  set(locationRef, {
    latitude: latitude,
    longitude: longitude,
    timestamp: new Date().toISOString(),
  })
    .then(() => {
      console.log("Location data written to database");
      alert("📍 Location sent successfully!");
    })
    .catch((error) => {
      console.error("Error sending location:", error);
      alert("⚠ Failed to send location. Please try again.");
    });
}

// Validate registration form
function validateForm(event) {
  event.preventDefault();

  const password = document.getElementById("password").value.trim();
  const aadhar = document.getElementById("aadhar").value.trim();
  let errorMsg = "";

  if (!password) {
    errorMsg += "Password is required.\n";
  } else if (password.length < 6) {
    errorMsg += "Password must be at least 6 characters long.\n";
  }

  if (!aadhar) {
    errorMsg += "Aadhar Number is required.\n";
  }

  if (!errorMsg) {
    addUser(aadhar, password);
    alert("Registration Successful!");
    document.getElementById("register-form").reset();
    window.location.href = "login.html";
  } else {
    alert(errorMsg);
  }
}

// DOMContentLoaded event for attaching listeners
document.addEventListener("DOMContentLoaded", () => {
  // SOS button
  const sosButton = document.getElementById("sos-button");
  if (sosButton) {
    sosButton.addEventListener("click", (event) => {
      event.preventDefault();
      const userId = localStorage.getItem("userId") || "guest";
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            sendLocationToDatabase(userId, latitude, longitude);
          },
          (error) => {
            alert("⚠ Unable to retrieve location. Please enable location services.");
          }
        );
      } else {
        alert("Geolocation API is not supported by this browser.");
      }
    });
  }

  // Register form
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", validateForm);
  }
});

// Test Firebase connection (optional, can be removed in production)
function testFirebaseConnection() {
  const testRef = ref(database, "test");
  set(testRef, { message: "Firebase is connected!" })
    .then(() => {
      console.log("Test data written to Firebase successfully!");
    })
    .catch((error) => {
      console.error("Error writing test data to Firebase:", error);
    });
}
testFirebaseConnection();



// Validate login credentials
export function validateLogin(address, password, onSuccess, onError) {
  // Example: Check credentials in Firebase
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${address}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.val();
      if (user.password === password) {
        onSuccess();
      } else {
        onError("Incorrect password.");
      }
    } else {
      onError("User not found.");
    }
  }).catch((error) => {
    onError("Login failed. Please try again.");
  });
}

// Do NOT put any <script> tags in this file!