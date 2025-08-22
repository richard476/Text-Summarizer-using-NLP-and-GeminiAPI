# Advanced Text Processor & AI Assistant

An advanced, full-stack text processing application featuring a suite of NLP tools powered by NLTK and the Gemini 2.5 Pro API. The project boasts a modern, professional UI with a dynamic, interactive 3D background built with Three.js.

---

## ✨ Features

* **Multi-Faceted Summarization:**
    * **Standard Summary:** Get a concise summary of long texts.
    * **Bulleted List:** Convert text into an easy-to-read bulleted list.
    * **Key Takeaways:** Extract the most critical points from the text.
* **Conversational AI Chat:**
    * **Ask Gemini:** Engage in a direct conversation with the Gemini 2.5 Pro model.
    * **Chat Memory:** The AI remembers the context of the conversation for follow-up questions.
    * **Clear Memory:** Reset the conversation at any time.
* **Utility Tools:**
    * **Link Extractor:** Automatically find and list all URLs within a block of text.
    * **PDF Exporter:** Download the generated output or chat history as a PDF document.
* **Stunning User Interface:**
    * **Interactive 3D Background:** A dynamic "Morphing Crystalline Structure" that reacts to cursor movement.
    * **Modern Aesthetics:** A sleek, "glassmorphism" UI with clean fonts and smooth animations.

---

## 🛠️ Tech Stack

* **Backend:**
    * **Python**
    * **Flask:** For the web server and API endpoints.
    * **Flask-CORS:** To handle cross-origin requests from the frontend.
    * **NLTK:** For classic, extractive NLP techniques.
    * **requests:** To communicate with the Gemini REST API.
    * **fpdf2:** For generating PDF documents.
* **Frontend:**
    * **HTML5**
    * **CSS3** (with custom properties)
    * **JavaScript (ES6+)**
    * **Three.js:** For the advanced 3D background animations.

---

## 🚀 Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. **Prerequisites**
* Ensure you have **Python 3.8+** installed and added to your system's PATH.

### 2. **Create a Virtual Environment**
Navigate to the project's root directory (`D:\MAJOR PROJECT SEP 2026`) in your terminal and create a virtual environment:
```bash
python -m venv venv