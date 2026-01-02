import { signOut } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

function logout() {
  signOut(window.firebaseAuth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Erro ao sair:", error);
      alert("Erro ao sair. Tente novamente.");
    });
}

// expõe para o HTML
window.logout = logout;
