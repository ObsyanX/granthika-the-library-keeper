<div align="center">

# ✨📚 **Granthikaḥ — The Library Keeper**  
### *A futuristic, animation-inspired Library Management System built with love, logic & books.*  
**WEBSITE: https://granthikah.lovable.app**
<br>

<img src="https://img.shields.io/badge/Status-Active-34D399?style=for-the-badge" />
<img src="https://img.shields.io/badge/Frontend-Modern%20UI-8B5CF6?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Contributors-1-yellow?style=for-the-badge" />

---

💠 *“Where knowledge meets elegance, and management becomes an experience.”*  
🌈 Smooth views • 🎭 Animated transitions • 📘 Book-centric experience

</div>

---

# 🌟 **Why Granthikaḥ?**  

Libraries deserve more than old-school, boring systems.  
**Granthikaḥ** reimagines library management with a blend of:

✨ *glassmorphism aesthetics*  
🎨 *soft and fluid micro-interactions*  
📌 *intuitive role-based flows*  
💡 *smart validations*  
⚡ *clean transitions & futuristic layout*

Everything feels **light**, **fast**, **alive**, and **book-friendly**.

### 🌈 **Key Highlights**
- 💫 *Glass + neon highlights:* modern, animated UI panels  
- 🔐 *Role-based UX:*  
  **Admin → Maintenance + Reports + Transactions**  
  **User → Reports + Transactions**  
- 📅 *Smart Forms:* powerful validation, auto-filled logic, constraints  
- 📦 *Modular architecture:* Easy to scale, theme, and extend  
- 📱 *Responsive:* mobile-friendly, fluid, adaptive layout  

---

# 📂 **Table of Contents**
- [Demo / Screenshots](#demo--screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How to Use](#how-to-use)
- [Core Features](#core-features)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

# 🧰 **Tech Stack**
- ⚛️ **React** (recommended; supports animations beautifully)
- 🎨 **HTML5 / Tailwind / CSS3**
- 🌀 Animated Transitions (Framer Motion / CSS transitions)
- 📁 JSON Mock Data (books, members, transactions)

---
## 🚀 Getting Started

Follow these quick steps to set up **Granthikaḥ** locally:

### 🔧 1. Clone the Repository
```bash
git clone https://github.com/ObsyanX/granthika-the-library-keeper.git
cd granthika-the-library-keeper
```
```
npm install
```
```
npm start
```
---
### 🗂️ Project Structure
/src
  /components       # Animated UI blocks, reusable controls  
  /pages            # Login, Dashboard, Maintenance, Reports, Transactions  
  /data             # JSON files: books, members, transactions  
  /styles           # Global CSS / Tailwind themes  
  /utils            # Validation helpers, date utilities, role guards  
  App.js            # Routing + base layout  
  index.js          # Entry point  

### 🎯 How to Use (Flow Overview)
🔐 Login
Choose Admin or User
Passwords are masked for security
🏠 Dashboard
Admins see:
Maintenance
Transactions
Reports
Users see:
Transactions
Reports

### ⚙️ Maintenance (Admin Only)

✔ Add / Update Books
✔ Add / Extend / Cancel Memberships
✔ Manage Users (New / Existing)
Every form includes:
Required field validations
Correct radio button & checkbox behavior
Inline error messages
### 🔄 Transactions Module
### 📘 Book Availability / Search
Must fill at least one field
Rows include selectable radio button for choosing books
### 📗 Issue Book
Auto-fills author
Auto-fills return date (+15 days)
Issue date cannot be earlier than today
Clean inline validation alerts
### 📕 Return Book

Auto-fills issue details
Serial Number is mandatory
Return date is editable (within allowed constraints)
Clicking Confirm always leads to Fine Pay

### 💰 Fine Payment

Auto-filled summary
If fine > 0 → must tick Fine Paid checkbox
If fine = 0 → straight confirm
### 📈 Reports Module
Includes:
# 📚 Available Books
# 📄 Issued Books
# 🧾 Member List
# ⏰ Overdue / Due Today

### ♻ Transaction History
Designed with clean tables + subtle hover animations.

### 🧩 Core Features (Spec Compliant)
Module	Features
Login	Masked passwords, role selection
Role Access	Admin = all modules; User = limited
Maintenance	Book/Movie CRUD, membership management, user management
Transactions	Search, Issue, Return, Fine Pay (with validations)
UI/UX	Radios, checkboxes, form errors, animations
Data Handling	JSON-based, supports all workflows
### 🛣️ Roadmap
🔮 Future Enhancements
🔗 Node.js + MySQL Backend
🔒 Advanced Auth & RBAC
🖼 Book Cover Previews
📬 Email Alerts (due reminders)
🌐 Multi-language UI (Eng + Sanskrit + Local)
📊 Analytics Dashboard
🎥 Movie Catalog Enhancements

### 🤝 Contributing
We welcome and appreciate contributions!
Here’s how you can help:
```
# 1. Fork the project
````
````
# 2. Create a feature branch
git checkout -b feature/YourFeature
````
````
# 3. Commit changes
git commit -m "Add some feature"
````
````
# 4. Push your branch
git push origin feature/YourFeature
````
```
# 5. Open a Pull Request 🎉
```

### 📄 License

This project is licensed under the MIT License.
See the LICENSE file for full details.

### ❤️ Credits

Crafted with passion by ObsyanX (Sayan Dutta)
Inspired by modern UI/UX principles & seamless micro-animations
Built to make library management beautiful and intuitive


<div align="center">
🎉 Thank You for Exploring Granthikaḥ
⭐ If you like this project, please star the repository!
📖 Happy Coding. Happy Reading.
</div> `


