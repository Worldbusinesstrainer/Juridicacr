# Legal AI Costa Rica â€” MVP inicial

Este es un **prototipo funcional de interfaz + backend local** para aprender y validar el flujo:
- Interfaz web estÃ¡tica (se puede publicar en GitHub Pages).
- Backend FastAPI separado.
- Carga de archivos TXT, PDF y DOCX al backend.
- ExtracciÃ³n de texto y fragmentaciÃ³n.
- RecuperaciÃ³n inicial por palabras clave (RAG bÃ¡sico).
- El chat devuelve fragmentos recuperados, **no inventa una respuesta jurÃ­dica generada por IA**.

## Limitaciones importantes
- No consulta SINALEVI, Nexus PJ, Corte IDH ni otras fuentes externas.
- No usa todavÃ­a un modelo de IA ni embeddings semÃ¡nticos.
- Los documentos se guardan en memoria del backend: se pierden al reiniciar.
- No hay autenticaciÃ³n ni separaciÃ³n de usuarios. **No cargue expedientes reales ni datos confidenciales.**
- El frontend de GitHub Pages no debe usarse para SaaS comercial ni para recibir informaciÃ³n sensible. Consulte las polÃ­ticas de GitHub Pages.
- El backend permite CORS desde cualquier origen solo para facilitar pruebas. Antes de desplegar, restrÃ­njalo al dominio del frontend.

## Estructura
- `frontend/index.html`, `styles.css`, `app.js`: interfaz.
- `backend/main.py`: API y recuperaciÃ³n bÃ¡sica.
- `backend/requirements.txt`: dependencias.

## Paso 1 â€” Publicar la interfaz en GitHub Pages
1. Cree un repositorio pÃºblico nuevo, por ejemplo `legal-ai-costa-rica`.
2. Suba **el contenido de la carpeta `frontend`** a la raÃ­z del repositorio (index.html debe quedar en la raÃ­z).
3. Abra **Settings â†’ Pages**.
4. En **Build and deployment**, seleccione **Deploy from a branch**.
5. Seleccione `main` y `/ (root)` y guarde.
6. Espere a que GitHub publique la pÃ¡gina.

La interfaz se abrirÃ¡, pero mostrarÃ¡ que el backend no estÃ¡ configurado hasta que lo conecte.

## Paso 2 â€” Ejecutar el backend en su computadora
Requiere Python 3.10 o posterior.

En una terminal, entre en la carpeta `backend` y ejecute:

```bash
python -m venv .venv
```

Activar entorno:
- Windows: `.venv\Scripts\activate`
- macOS/Linux: `source .venv/bin/activate`

Instalar dependencias e iniciar:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

API disponible en `http://127.0.0.1:8000`; documentaciÃ³n interactiva en `http://127.0.0.1:8000/docs`.

**Nota:** una web publicada en internet no puede acceder a `127.0.0.1` de la computadora de quien la visita. Para probar frontend + backend en la misma computadora, abra `frontend/index.html` en el navegador y deje el backend ejecutÃ¡ndose. En el campo â€œURL del backendâ€ use `http://127.0.0.1:8000`.

## Paso 3 â€” Conectar frontend y backend
En el panel de la interfaz, escriba la URL del backend y pulse â€œGuardar conexiÃ³nâ€. Para una prueba local use:
`http://127.0.0.1:8000`

## CÃ³mo probar
1. Inicie el backend.
2. Abra `frontend/index.html`.
3. Configure la URL del backend.
4. Cargue un archivo pequeÃ±o TXT, PDF o DOCX.
5. Escriba una pregunta relacionada con el documento.
6. El sistema mostrarÃ¡ los fragmentos recuperados y sus nombres de archivo.

Si no se encuentran fragmentos, el sistema lo informa. No presenta una consulta externa ni una verificaciÃ³n legal como realizada.

## PrÃ³ximas fases antes de uso real
1. AÃ±adir autenticaciÃ³n, autorizaciÃ³n y almacenamiento privado persistente.
2. Restringir CORS, validar tipos/tamaÃ±o de archivo y aplicar lÃ­mites de uso.
3. AÃ±adir bÃºsqueda hÃ­brida/embeddings y un modelo de IA con citas ligadas a fragmentos.
4. AÃ±adir conectores autorizados a fuentes jurÃ­dicas oficiales.
5. AÃ±adir pruebas de seguridad, privacidad y evaluaciÃ³n de exactitud jurÃ­dica.
