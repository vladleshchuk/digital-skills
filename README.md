# Master's Thesis Project: "Digital S-kills"

**A web platform for managing and taking educational courses on digital skills, developed as part of a master's thesis.**

This project is a practical implementation of a Corporate Information System (CIS) in the form of a Learning Management System (LMS).

The system allows for the administration of educational content (courses, modules, tasks) and provides students with the ability to take courses, track their progress, and receive a certificate upon completion.

---

## 🚀 Core Functionality

* **Role-Based Access Control (RBAC):** A complete authentication system with two access levels:
    * [cite_start]**Student:** Can register [cite: 2362-2371][cite_start], take an assessment test, enroll in courses, complete tasks, and download a certificate [cite: 1-54].
    * [cite_start]**Admin:** Has full CRUD access to manage courses, modules [cite: 406-412][cite_start], and tasks [cite: 442-458].

* [cite_start]**Assessment System:** An initial 5-question test to determine the user's least developed digital skills (based on the `tests` table [cite: 31-36]). The test results can recommend specific course categories.

* [cite_start]**Learning Progress:** Each user has individual progress for every course, tracked in the `enrollments` table [cite: 20-27]. Statuses are updated automatically:
    * Not started
    * [cite_start]In progress (after completing the first task [cite: 227-234])
    * [cite_start]Completed (after all tasks are finished [cite: 247-251])

* [cite_start]**Dynamic Document Generation:** Automatic generation of a `.docx` certificate [cite: 14-18, 55-61] upon successful course completion. [cite_start]The system uses a template (`certificate_template.docx`) and populates it with user data (`{users_name}`, `{course_title}`, etc.) [cite: 20, 22-25].

* [cite_start]**Dynamic Filtering:** The main courses page features server-side filtering by title (search), dimensions (checkboxes), difficulty (checkboxes), and duration (radio buttons) [cite: 74-118].

---

## 🛠️ Technology Stack

This project is built on server-side JavaScript using an MVC-like architecture.

### 🖥️ Backend
* **Node.js:** The runtime environment that allows JavaScript to run on the server.
* [cite_start]**Express.js:** The primary framework for handling HTTP requests, routing, and middleware [cite: 2174, 2197-2198].
* **Handlebars (`hbs`):** The template engine used for Server-Side Rendering (SSR). [cite_start]It assembles `.hbs` files (like `index.hbs`, `menu.hbs`, `courses.hbs`) into a single HTML page on the server before sending it to the user [cite: 906, 908, 1150-1167].
* [cite_start]**`express-session`:** Used for authentication and managing user sessions [cite: 2174, 2211-2216].
* **`mysql2`:** The driver (library) that allows the Node.js application to connect and execute queries against the MySQL database.
* [cite_start]**`docxtemplater` & `pizzip`:** Libraries used to generate `.docx` files (certificates) based on a template [cite: 57-58].

### 🎨 Frontend
* **HTML5 / CSS3:** Structure and styling for all pages.
* [cite_start]**Bootstrap 4:** The main UI framework used for the grid system, cards, buttons, navigation (navbar), forms, and accordions [cite: 912, 961-962].
* [cite_start]**Google Fonts:** Custom fonts (**Montserrat** for headings, **Roboto** for text) to enhance typography [cite: 2471-2480].
* **Bootstrap Icons:** Used for icons in the menu and on buttons.
* [cite_start]**JavaScript (AJAX):** "Plain" JS (`XMLHttpRequest`) is used on the `start.hbs` login page for asynchronous authentication and error display without a full page reload [cite: 2696-2698].

### 🗃️ Database
* **MySQL (MariaDB):** The relational database used to store all data (users, courses, modules, tasks, progress, tests).
* **XAMPP:** The local server stack used to run Apache and MySQL.
* **Navicat / MySQL-Front:** GUI tools used for designing and administering the database.

---

## 🚀 Installation and Setup

1.  Clone the repository.
2.  Navigate to the project directory:
    ```bash
    cd digital-skills
    ```
3.  Install all required dependencies:
    ```bash
    npm install
    ```
4.  **Database Setup:**
    * Ensure you have a local MySQL server running (e.g., via XAMPP).
    * Create a new database named `digitalskills`.
    * Import the `digitalskills.sql` database dump into your DBMS.
    * [cite_start]Check the connection settings (host, user, password) in `index.js` within the `createStore()` function [cite: 2202-2208].
5.  **Certificate Setup:**
    * Create a file named `certificate_template.docx` in the project's root directory.
    * Design it as a certificate and add the necessary placeholder tags: `{users_name}`, `{course_title}`, `{completion_date}`.
6.  Run the server in development mode (with `nodemon`):
    ```bash
    npm run dev
    ```
7.  Open `http://localhost:3000` in your browser.

---

## 👨‍💻 Author

* **Vladyslav Leshchuk**
* [cite_start]Master's Thesis, National University of Water and Environmental Engineering (NUWEE) [cite: 2706-2707].
