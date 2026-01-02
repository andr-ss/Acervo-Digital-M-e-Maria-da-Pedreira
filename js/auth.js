import { signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro-login");

  erro.innerText = "";

  if (!email || !senha) {
    erro.innerText = "Preencha email e senha.";
    return;
  }

  signInWithEmailAndPassword(window.firebaseAuth, email, senha)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch((error) => {
      console.error("Erro de login:", error);
      erro.innerText = "Email ou senha inválidos.";
    });
}

// torna a função acessível ao botão HTML
window.login = login;
