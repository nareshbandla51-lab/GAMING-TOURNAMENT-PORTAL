# 🎮 Gaming Tournament Portal

A professional-looking **Gaming Tournament Portal** built for an SDC project using only **HTML, CSS and JavaScript**. The project demonstrates a two-module business system with **User** and **Admin** roles, browser-based authentication, tournament registration and administration.

## ✨ Modules

### User Module
- Signup and Login
- Browse and search tournaments
- Filter by game and Free/Paid type
- View tournament details
- Register for tournaments
- View My Tournaments
- View player profile
- Logout

### Admin Module
- Admin Login
- Dashboard statistics
- Create tournament
- Edit tournament
- Delete tournament
- Manage registered users
- Ban / Unban users

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- LocalStorage
- Git / GitHub

No backend, framework, database or external library is required.

## 🔐 Demo Admin Login

**Email:** `admin@gamezone.com`  
**Password:** `admin123`

> This is a classroom/demo credential. For a real application, authentication should use secure server-side storage and hashed passwords.

## 🧭 Main Flow

```text
Home → Signup/Login → Role Check
                     ├── User → Dashboard → Tournaments → Register → My Tournaments
                     └── Admin → Dashboard → Tournaments / Users
```

## 📦 LocalStorage Keys

| Key | Purpose |
|---|---|
| `gz_users` | User and admin accounts |
| `gz_session` | Current logged-in session |
| `gz_tournaments` | Tournament records |
| `gz_registrations` | Tournament registrations |

## 🖼️ Add Your Own Photos

Create or use these files inside `assets/images/`:

```text
assets/images/
├── hero-gaming.jpg
├── cod.jpg
├── free-fire.jpg
├── valorant.jpg
├── fortnite.jpg
└── video-poster.jpg
```

The HTML already references these paths. Replace the files with your own screenshots, game artwork or student-made designs.

## 🎞️ Add Your Own Animation Video

Put your student-made video here:

```text
assets/videos/arena-intro.mp4
```

The home page already contains a muted, looping `<video>` element. A CSS animated fallback is visible when the MP4 is not present.

## 🎨 Student-Made CSS Animation

The project includes custom CSS animations such as:

- `float` — floating hero elements
- `spin` — energy rings
- `pulse` — live status indicator
- `ticker` — moving game-name strip
- `sheen` — card highlight sweep
- `rise` — section entrance animation
- `glitch` — gaming title effect

These are implemented in CSS using `@keyframes`, without animation libraries.

## ▶️ Run the Project

1. Download or clone the repository.
2. Open `index.html` in a browser.
3. For the best demonstration, use a simple local static server if your browser restricts local files.
4. Create a user account through `signup.html`.
5. Log in as a user or use the demo admin account.

## ✅ SDC Requirement Mapping

| SDC Requirement | Project Implementation |
|---|---|
| Problem statement | Gaming tournament management |
| Business system | Gaming Tournament Management System |
| Minimum two modules | User + Admin |
| HTML/CSS/JS only | Yes |
| Grid/Flexbox | Used throughout responsive UI |
| Signup/Login | LocalStorage |
| Module redirection | JavaScript role-based navigation |
| Working functionality | Tournament CRUD, registration, user management |
| GitHub | Repository-ready structure |
| Demonstration | User and Admin complete flows |

## 👨‍💻 Project

**Gaming Tournament Portal**  
SDC Academic Project • 2026
