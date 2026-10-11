
const API_URL = "http://127.0.0.1:8000";

const $ = (selector) => document.querySelector(selector);

document.querySelectorAll(".nav").forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;

    document.querySelectorAll(".page").forEach((section) => {
      section.classList.add("hidden");
    });

    document.querySelectorAll(".nav").forEach((item) => {
      item.classList.remove("active");
    });

    $("#page-" + page).classList.remove("hidden");
    button.classList.add("active");

    const titles = {
      chat: "Chat jurídico",
      library: "Mi biblioteca",
      sources: "Fuentes jurídicas"
    };

    $("#page-title").textContent = titles[page];

    if (page === "library") {
      loadDocuments();
    }
  });
});

async function apiRequest(path, options = {}) {
  const response = await fetch(API_URL + path, options);

  if (!response.ok) {
    throw new Error("Error HTTP " + response.status);
  }

  return response.json();
}

async function checkBackend() {
  try {
    await apiRequest("/health");
    $("#connection-status").textContent = "Backend conectado";
    document.querySelector(".status-dot").style.background = "#22c55e";
    return true;
  } catch {
    $("#connection-status").textContent = "Backend sin conexión";
    document.querySelector(".status-dot").style.background = "#eab308";
    return false;
  }
}

function addMessage(text, sender = "assistant", sources = []) {
  const message = document.createElement("div");
  message.className = "message";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = sender === "assistant" ? "L" : "T";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const heading = document.createElement("strong");
  heading.textContent =
    sender === "assistant" ? "Legal AI Costa Rica" : "Tu consulta";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  bubble.append(heading, paragraph);

  sources.forEach((source) => {
    const item = document.createElement("p");
    item.textContent =
      source.filename + ": " + source.text;

    bubble.append(item);
  });

  message.append(avatar, bubble);
  $("#messages").append(message);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

$("#chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = $("#question").value.trim();

  if (!question) return;

  addMessage(question, "user");
  $("#question").value = "";

  if (!(await checkBackend())) {
    addMessage(
      "No se pudo procesar la consulta. El backend no está conectado. " +
      "No se realizó una búsqueda jurídica."
    );
    return;
  }

  try {
    const result = await apiRequest("/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
        top_k: 5
      })
    });

    if (!result.results || result.results.length === 0) {
      addMessage(
        "No se encontraron fragmentos relacionados en los documentos " +
        "indexados. No se consultaron fuentes jurídicas externas."
      );
      return;
    }

    addMessage(
      "Estos son los fragmentos recuperados. No constituyen una " +
      "conclusión jurídica verificada.",
      "assistant",
      result.results
    );
  } catch (error) {
    addMessage("La búsqueda falló: " + error.message);
  }
});

$("#file-input").addEventListener("change", (event) => {
  $("#upload-button").disabled = event.target.files.length === 0;
});

$("#upload-button").addEventListener("click", async () => {
  const input = $("#file-input");
  const files = input.files;

  if (!files.length) return;

  if (!(await checkBackend())) {
    $("#upload-status").textContent =
      "No se subieron archivos: backend sin conexión.";
    return;
  }

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  $("#upload-button").disabled = true;
  $("#upload-status").textContent = "Procesando documentos...";

  try {
    const result = await apiRequest("/documents", {
      method: "POST",
      body: formData
    });

    $("#upload-status").textContent =
      "Documentos procesados: " +
      result.documents.map((doc) => doc.filename).join(", ");

    input.value = "";
    await loadDocuments();
  } catch (error) {
    $("#upload-status").textContent =
      "No se pudo completar la carga: " + error.message;
  } finally {
    $("#upload-button").disabled = input.files.length === 0;
  }
});

async function loadDocuments() {
  const list = $("#documents-list");
  list.replaceChildren();

  try {
    const result = await apiRequest("/documents");

    if (!result.documents.length) {
      list.textContent = "No hay documentos indexados.";
      return;
    }

    result.documents.forEach((doc) => {
      const item = document.createElement("div");
      item.className = "source";

      const details = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = doc.filename;

      const description = document.createElement("p");
      description.textContent =
        doc.chunk_count + " fragmentos · " +
        doc.char_count + " caracteres";

      details.append(name, description);
      item.append(details);
      list.append(item);
    });
  } catch {
    list.textContent =
      "No se pudo consultar la biblioteca. Revise la conexión al backend.";
  }
}

checkBackend();
