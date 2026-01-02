import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(window.firebaseAuth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

