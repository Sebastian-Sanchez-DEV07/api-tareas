/**
 * Cliente HTTP para la API RESTful de tareas.
 * Adjunta el JWT a cada petición y maneja errores de forma uniforme.
 */
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem("token");
    }

    guardarToken(token) {
        this.token = token;
        localStorage.setItem("token", token);
    }

    limpiarToken() {
        this.token = null;
        localStorage.removeItem("token");
    }

    autenticado() {
        return Boolean(this.token);
    }

    async request(metodo, ruta, body) {
        const opciones = {
            method: metodo,
            headers: { "Content-Type": "application/json" }
        };
        if (this.token) opciones.headers.Authorization = `Bearer ${this.token}`;
        if (body) opciones.body = JSON.stringify(body);

        const respuesta = await fetch(`${this.baseUrl}${ruta}`, opciones);
        const datos = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            const error = new Error(datos.error || `Error HTTP ${respuesta.status}`);
            error.status = respuesta.status;
            throw error;
        }
        return datos;
    }

    login(email, contrasena) {
        return this.request("POST", "/login", { email, contrasena });
    }

    registrar(nombre, email, contrasena) {
        return this.request("POST", "/register", { nombre, email, contrasena });
    }

    obtenerTareas() {
        return this.request("GET", "/tareas");
    }

    crearTarea(titulo, descripcion) {
        return this.request("POST", "/tareas", { titulo, descripcion });
    }

    actualizarTarea(id, cambios) {
        return this.request("PUT", `/tareas/${id}`, cambios);
    }

    eliminarTarea(id) {
        return this.request("DELETE", `/tareas/${id}`);
    }
}

/* ---------- reloj ---------- */

const updateClock = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`;
};

updateClock();
setInterval(updateClock, 1000);

/* ---------- elementos del DOM ---------- */

const api = new ApiClient("");

const authView = document.getElementById("auth-view");
const tasksView = document.getElementById("tasks-view");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const registerPanel = document.getElementById("register-panel");
const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");
const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");
const sessionUser = document.getElementById("session-user");
const apiStatus = document.getElementById("api-status");
const logoutButton = document.getElementById("logout-button");

const taskForm = document.getElementById("task-form");
const tituloInput = document.getElementById("titulo-input");
const descripcionInput = document.getElementById("descripcion-input");
const formMessage = document.getElementById("form-message");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCount = document.getElementById("task-count");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

/* ---------- vistas ---------- */

const mostrarMensaje = (elemento, texto, esError = false) => {
    elemento.textContent = texto;
    elemento.classList.toggle("error", esError);
};

const mostrarVistaTareas = () => {
    authView.hidden = true;
    tasksView.hidden = false;
    sessionUser.textContent = localStorage.getItem("nombreUsuario") || "unknown";
    apiStatus.textContent = "online";
    apiStatus.className = "online";
};

const mostrarVistaAuth = () => {
    tasksView.hidden = true;
    authView.hidden = false;
    apiStatus.textContent = "offline";
    apiStatus.className = "offline";
};

const manejarSesionExpirada = () => {
    api.limpiarToken();
    mostrarVistaAuth();
    mostrarMensaje(loginMessage, "> Session expired. Login again.", true);
};

/* ---------- autenticación ---------- */

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const contrasena = document.getElementById("login-password").value;

    try {
        mostrarMensaje(loginMessage, "> connecting...");
        const respuesta = await api.login(email, contrasena);
        api.guardarToken(respuesta.token);
        localStorage.setItem("nombreUsuario", email);
        loginForm.reset();
        mostrarMensaje(loginMessage, "");
        mostrarVistaTareas();
        await cargarTareas();
    } catch (error) {
        mostrarMensaje(loginMessage, `> ERROR: ${error.message}`, true);
    }
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nombre = document.getElementById("register-nombre").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const contrasena = document.getElementById("register-contrasena").value;

    try {
        mostrarMensaje(registerMessage, "> creating user...");
        await api.registrar(nombre, email, contrasena);
        registerForm.reset();
        mostrarMensaje(registerMessage, "> User created. Login with your credentials.");
    } catch (error) {
        mostrarMensaje(registerMessage, `> ERROR: ${error.message}`, true);
    }
});

switchToRegister.addEventListener("click", () => {
    registerPanel.hidden = false;
    loginForm.parentElement.hidden = true;
    document.getElementById("register-nombre").focus();
});

switchToLogin.addEventListener("click", () => {
    registerPanel.hidden = true;
    loginForm.parentElement.hidden = false;
    document.getElementById("login-email").focus();
});

logoutButton.addEventListener("click", () => {
    api.limpiarToken();
    localStorage.removeItem("nombreUsuario");
    mostrarVistaAuth();
    mostrarMensaje(loginMessage, "> Session closed.");
});

/* ---------- tareas ---------- */

let tareas = [];

const renderizarTareas = () => {
    taskList.innerHTML = "";
    emptyState.hidden = tareas.length > 0;

    tareas.forEach((tarea) => {
        const item = document.createElement("li");
        item.className = `task-item${tarea.completada ? " completed" : ""}`;
        item.dataset.id = tarea.id;

        const checkbox = document.createElement("input");
        checkbox.className = "task-check";
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.setAttribute("aria-label", `Complete ${tarea.titulo}`);

        const content = document.createElement("div");
        content.className = "task-content";
        content.innerHTML = `
            <span class="task-title"></span>
            <span class="task-desc"></span>
        `;
        content.querySelector(".task-title").textContent = tarea.titulo;
        content.querySelector(".task-desc").textContent = tarea.descripcion;

        const actions = document.createElement("div");
        actions.className = "task-actions";
        actions.innerHTML = `
            <button type="button" data-action="edit">EDIT</button>
            <button type="button" data-action="delete">DELETE</button>
        `;

        item.append(checkbox, content, actions);
        taskList.appendChild(item);
    });

    const completadas = tareas.filter((tarea) => tarea.completada).length;
    const total = tareas.length;
    const progreso = total === 0 ? 0 : Math.round((completadas / total) * 100);
    taskCount.textContent = `${completadas} / ${total}`;
    progressBar.style.width = `${progreso}%`;
    progressText.textContent = `${progreso}% complete`;
};

const cargarTareas = async () => {
    try {
        tareas = await api.obtenerTareas();
        renderizarTareas();
    } catch (error) {
        if (error.status === 401) manejarSesionExpirada();
    }
};

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const titulo = tituloInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (!titulo || !descripcion) {
        mostrarMensaje(formMessage, "> ERROR: title and description required", true);
        return;
    }

    try {
        const nueva = await api.crearTarea(titulo, descripcion);
        tareas.push(nueva);
        taskForm.reset();
        mostrarMensaje(formMessage, "> Task added successfully");
        renderizarTareas();
        tituloInput.focus();
    } catch (error) {
        if (error.status === 401) manejarSesionExpirada();
        else mostrarMensaje(formMessage, `> ERROR: ${error.message}`, true);
    }
});

taskList.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const item = button.closest(".task-item");
    const id = Number(item.dataset.id);
    const tarea = tareas.find((elemento) => elemento.id === id);

    if (button.dataset.action === "delete") {
        try {
            await api.eliminarTarea(id);
            tareas = tareas.filter((elemento) => elemento.id !== id);
            renderizarTareas();
        } catch (error) {
            if (error.status === 401) manejarSesionExpirada();
        }
        return;
    }

    if (button.dataset.action === "edit") {
        const content = item.querySelector(".task-content");
        const editTitulo = document.createElement("input");
        editTitulo.className = "edit-input";
        editTitulo.type = "text";
        editTitulo.maxLength = 80;
        editTitulo.value = tarea.titulo;
        editTitulo.setAttribute("aria-label", "Edit title");

        const editDesc = document.createElement("input");
        editDesc.className = "edit-input desc";
        editDesc.type = "text";
        editDesc.maxLength = 160;
        editDesc.value = tarea.descripcion;
        editDesc.setAttribute("aria-label", "Edit description");

        content.replaceChildren(editTitulo, editDesc);
        button.textContent = "SAVE";
        button.dataset.action = "save-edit";
        item.querySelector('[data-action="delete"]').textContent = "CANCEL";
        item.querySelector('[data-action="delete"]').dataset.action = "cancel-edit";
        editTitulo.focus();
        editTitulo.select();
        return;
    }

    if (button.dataset.action === "save-edit") {
        const inputs = item.querySelectorAll(".edit-input");
        const nuevoTitulo = inputs[0].value.trim();
        const nuevaDesc = inputs[1].value.trim();

        if (nuevoTitulo && nuevaDesc) {
            try {
                const actualizada = await api.actualizarTarea(id, {
                    titulo: nuevoTitulo,
                    descripcion: nuevaDesc
                });
                Object.assign(tarea, actualizada);
                renderizarTareas();
            } catch (error) {
                if (error.status === 401) manejarSesionExpirada();
            }
        }
        return;
    }

    if (button.dataset.action === "cancel-edit") {
        renderizarTareas();
    }
});

taskList.addEventListener("change", async (event) => {
    if (!event.target.classList.contains("task-check")) return;

    const item = event.target.closest(".task-item");
    const id = Number(item.dataset.id);
    const tarea = tareas.find((elemento) => elemento.id === id);
    if (!tarea) return;

    try {
        const actualizada = await api.actualizarTarea(id, {
            completada: !tarea.completada
        });
        Object.assign(tarea, actualizada);
        renderizarTareas();
    } catch (error) {
        if (error.status === 401) manejarSesionExpirada();
    }
});

/* ---------- inicio ---------- */

if (api.autenticado()) {
    mostrarVistaTareas();
    cargarTareas();
} else {
    mostrarVistaAuth();
}
