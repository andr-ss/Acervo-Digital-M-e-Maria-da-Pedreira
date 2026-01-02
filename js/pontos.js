// ================================
// Firebase (MODULAR)
// ================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ================================
// Config Firebase
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyAedawDMNM2JeMkDNxcIkTlTM6-Qoc5Ops",
  authDomain: "acervo-mae-maria-da-pedreira.firebaseapp.com",
  projectId: "acervo-mae-maria-da-pedreira",
  storageBucket: "acervo-mae-maria-da-pedreira.appspot.com",
  messagingSenderId: "418579721002",
  appId: "1:418579721002:web:61241997971bb0c55ecc53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================================
// Helpers
// ================================
function $(id) {
  return document.getElementById(id);
}

function setLoading(el, text = "Carregando...") {
  if (!el) return;
  el.innerHTML = `<p>${text}</p>`;
}

function clear(el) {
  if (!el) return;
  el.innerHTML = "";
}

function setActive(container, activeBtn) {
  if (!container) return;
  container.querySelectorAll(".categoria-item").forEach((btn) => {
    btn.classList.remove("ativo");
  });
  if (activeBtn) activeBtn.classList.add("ativo");
}

// ================================
// Inicializa quando DOM estiver pronto
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const listaLinhasTrabalho = $("linhas-trabalho");
  const listaOrixas = $("linhas-orixas");
  const listaPontos = $("lista-pontos");

  if (!listaLinhasTrabalho || !listaOrixas || !listaPontos) {
    console.error("IDs não encontrados no HTML. Verifique: linhas-trabalho, linhas-orixas, lista-pontos");
    return;
  }

  // ================================
  // Carregar categorias
  // ================================
  async function carregarCategorias() {
    clear(listaLinhasTrabalho);
    clear(listaOrixas);
    setLoading(listaPontos, "Selecione uma categoria para ver os pontos.");

    const q = query(
      collection(db, "categorias_pontos"),
      where("ativo", "==", true),
      orderBy("ordem")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const categoria = docSnap.data();

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "categoria-item";
      btn.textContent = categoria.nome;
      btn.dataset.categoriaId = docSnap.id;

      btn.addEventListener("click", async () => {
        // marca ativo na coluna certa
        if (categoria.tipo === "linha_trabalho") setActive(listaLinhasTrabalho, btn);
        if (categoria.tipo === "orixa") setActive(listaOrixas, btn);

        await carregarPontos(docSnap.id);
      });

      if (categoria.tipo === "linha_trabalho") {
        listaLinhasTrabalho.appendChild(btn);
      } else if (categoria.tipo === "orixa") {
        listaOrixas.appendChild(btn);
      }
    });
  }

  // ================================
  // Carregar pontos cantados
  // ================================
  async function carregarPontos(categoriaId) {
    setLoading(listaPontos, "Carregando pontos...");

    const q = query(
      collection(db, "pontos_cantados"),
      where("ativo", "==", true),
      where("categoria_id", "==", categoriaId),
      orderBy("ordem")
    );

    const snapshot = await getDocs(q);

    clear(listaPontos);

    if (snapshot.empty) {
      listaPontos.innerHTML = "<p>Nenhum ponto cadastrado para essa linha.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const ponto = docSnap.data();

      const div = document.createElement("div");
      div.className = "ponto";

      div.innerHTML = `
        <h3>${ponto.titulo ?? "Sem título"}</h3>
        <pre>${ponto.letra ?? ""}</pre>
        ${
          ponto.audio_url
            ? `<audio controls src="${ponto.audio_url}"></audio>`
            : ""
        }
      `;

      listaPontos.appendChild(div);
    });
  }

  // Start
  carregarCategorias().catch((e) => console.error("Erro ao carregar categorias:", e));
});
