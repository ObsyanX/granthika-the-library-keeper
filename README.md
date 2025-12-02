<div align="center">

# ✨📚 **Granthikaḥ — The Library Keeper**  
### *A futuristic, animation-inspired Library Management System built with love, logic & books.*  
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

# 🚀 **Getting Started**

```bash
# 1. Clone the repository  
git clone https://github.com/ObsyanX/granthika-the-library-keeper.git  
cd granthika-the-library-keeper  

# 2. Install dependencies  
npm install  

# 3. Run the development server  
npm start  

# 4. Visit in browser  
http://localhost:3000/
If you're using a different framework, adapt steps accordingly.

🗂️ Project Structure
bash
Copy code
/src
  /components        # Animated UI blocks, reusable elements  
  /pages             # Login, Dashboard, Maintenance, Reports, Transactions  
  /data              # JSON files: books, members, transactions  
  /styles            # CSS / Tailwind / theme utilities  
  /utils             # Helpers: validation, date checks, role guards  
  App.js             # Routing + base layout  
  index.js           # Entry point  
🎯 How to Use (Flow Overview)
🔐 Login
Choose:

Admin

User
Password fields are masked.

🏠 Dashboard
Admins see:

Maintenance

Transactions

Reports

Users see:

Transactions

Reports

⚙️ Maintenance (Admin Only)
✔ Add / Update Books
✔ Add / Extend / Cancel Memberships
✔ New / Existing User Management

Each form has:

Required validations

Proper radio/checkbox behavior

Error messages inline

🔄 Transactions
📘 Book Availability / Search
At least one field must be filled

Each row has a selectable radio button

📗 Issue Book
Auto-fill: author, return date (+15 days)

Issue date ≥ today

Validation warnings shown beautifully

📕 Return Book
Auto-populated issue info

Serial No mandatory

Return date editable (± allowed)

Confirm → leads to Fine Pay (always)

💰 Fine Payment
Auto-filled details

If fine > 0 → checkbox must be checked

If fine = 0 → direct confirm

📈 Reports Module
📚 Available Books

📄 Issued Books

🧾 Member List

⏰ Overdue / Due Today

♻ Transaction History

Beautiful data tables with subtle hover animations.

🧩 Core Features (Spec-Compliant)
Module	Features
Login	Masked passwords, role selection
Role Access	Admin = all modules; User = limited
Maintenance	Book/Movie add/update, membership CRUD, user management
Transactions	Search, Issue, Return, Fine Pay (full validation)
UI/UX	Radios, checkboxes, error states, animated transitions
Data	JSON-based structure for all flows

🛣️ Roadmap
🚀 Future Enhancements:
🔗 Backend Integration (Node.js + MySQL)

🔒 Advanced Auth + Permissions

🖼 Book Cover Rendering

📬 Email Notifications (due reminders)

🌐 Multi-Language Support (English + Sanskrit + Local)

📊 Dashboard Analytics

🎥 Movie Media Support (extended catalog)

🤝 Contributing
We welcome contributions!

Steps:
bash
Copy code
# 1. Fork the project
# 2. Create branch 
git checkout -b feature/YourFeature

# 3. Commit changes
git commit -m "Add some feature"

# 4. Push
git push origin feature/YourFeature

# 5. Submit Pull Request 🎉
📄 License
This project is under the MIT License.
See the LICENSE file for more details.

❤️ Credits
Crafted passionately by ObsyanX (Sayan Dutta)

Inspired by modern UI design, animations & the love of books

Built for clean, intuitive, satisfying library interactions

<div align="center">
🎉 Thank you for exploring Granthikaḥ
⭐ If you enjoyed this project, please star the repo — it means a lot!
📖 Happy coding. Happy reading.

</div> ```
