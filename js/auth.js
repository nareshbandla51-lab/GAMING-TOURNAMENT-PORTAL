(function () {

    /* =========================================
       STORAGE KEYS
       ========================================= */

    const USERS_KEY = "gz_users";
    const SESSION_KEY = "gz_session";


    /* =========================================
       DEMO ADMIN
       ========================================= */

    const seedAdmin = {

        id: "admin-001",

        name: "GameZone Admin",

        email: "admin@gamezone.com",

        password: "admin123",

        role: "admin",

        status: "active",

        createdAt: "2026-09-01T09:00:00"

    };


    /* =========================================
       DEMO ORGANIZER
       ========================================= */

    const seedOrganizer = {

        id: "org-001",

        name: "GameZone Organizer",

        email: "organizer@gamezone.com",

        password: "organizer123",

        role: "organizer",

        status: "active",

        createdAt: "2026-09-02T09:00:00"

    };


    /* =========================================
       GET USERS
       ========================================= */

    function getUsers() {

        try {

            return JSON.parse(
                localStorage.getItem(USERS_KEY) || "[]"
            );

        } catch (error) {

            console.error(
                "Could not read users:",
                error
            );

            return [];

        }

    }


    /* =========================================
       SAVE USERS
       ========================================= */

    function saveUsers(users) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    }


    /* =========================================
       CREATE DEMO ACCOUNTS
       ========================================= */

    function ensureAdmin() {

        let users = getUsers();

        let changed = false;


        /* ADMIN */

        if (
            !users.some(
                user =>
                    user.email === seedAdmin.email
            )
        ) {

            users.push(seedAdmin);

            changed = true;

        }


        /* ORGANIZER */

        if (
            !users.some(
                user =>
                    user.email === seedOrganizer.email
            )
        ) {

            users.push(seedOrganizer);

            changed = true;

        }


        if (changed) {

            saveUsers(users);

        }

    }


    /* =========================================
       SESSION
       ========================================= */

    function getSession() {

        try {

            return JSON.parse(
                localStorage.getItem(SESSION_KEY) || "null"
            );

        } catch (error) {

            return null;

        }

    }


    function setSession(user) {

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(user)
        );

    }


    function clearSession() {

        localStorage.removeItem(
            SESSION_KEY
        );

    }


    /* =========================================
       ROLE BASED REDIRECTION
       ========================================= */

    function redirectByRole(user) {

        if (!user) return;


        /* ADMIN */

        if (user.role === "admin") {

            window.location.href =
                "admin/dashboard.html";

            return;

        }


        /* ORGANIZER */

        if (user.role === "organizer") {

            window.location.href =
                "organizer/dashboard.html";

            return;

        }


        /* USER / PLAYER */

        window.location.href =
            "user/dashboard.html";

    }


    /* =========================================
       TOAST
       ========================================= */

    function toast(
        message,
        type = "success"
    ) {

        const oldToast =
            document.querySelector(".toast");


        if (oldToast) {

            oldToast.remove();

        }


        const element =
            document.createElement("div");


        element.className =
            `toast ${type}`;


        element.textContent =
            message;


        document.body.appendChild(
            element
        );


        setTimeout(
            () => element.remove(),
            2800
        );

    }


    /* =========================================
       AUTH PROTECTION
       ========================================= */

    function requireAuth(role) {

        const session =
            getSession();


        /* NOT LOGGED IN */

        if (!session) {

            window.location.href =
                "../login.html";

            return null;

        }


        /* ROLE PROTECTION */

        if (
            role &&
            session.role !== role
        ) {


            /* ADMIN */

            if (
                session.role === "admin"
            ) {

                window.location.href =
                    "../admin/dashboard.html";

                return null;

            }


            /* ORGANIZER */

            if (
                session.role === "organizer"
            ) {

                window.location.href =
                    "../organizer/dashboard.html";

                return null;

            }


            /* PLAYER */

            window.location.href =
                "../user/dashboard.html";

            return null;

        }


        return session;

    }


    /* =========================================
       PASSWORD SHOW / HIDE
       ========================================= */

    function setupPasswordToggles() {

        document
            .querySelectorAll(".show-pass")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const input =
                            document.getElementById(
                                button.dataset.target
                            );


                        if (!input) return;


                        if (
                            input.type ===
                            "password"
                        ) {

                            input.type =
                                "text";

                            button.textContent =
                                "Hide";

                        } else {

                            input.type =
                                "password";

                            button.textContent =
                                "Show";

                        }

                    }
                );

            });

    }


    /* =========================================
       SIGNUP
       ========================================= */

    function setupSignup() {

        const signupForm =
            document.getElementById(
                "signupForm"
            );


        if (!signupForm) return;


        signupForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "signupName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "signupEmail"
                    ).value
                        .trim()
                        .toLowerCase();


                const role =
                    document.getElementById(
                        "signupRole"
                    ).value;


                const password =
                    document.getElementById(
                        "signupPassword"
                    ).value;


                const confirm =
                    document.getElementById(
                        "signupConfirm"
                    ).value;


                const message =
                    document.getElementById(
                        "signupMessage"
                    );


                /* PASSWORD CHECK */

                if (
                    password !== confirm
                ) {

                    message.className =
                        "form-message error";

                    message.textContent =
                        "Passwords do not match.";

                    return;

                }


                /* PASSWORD LENGTH */

                if (
                    password.length < 6
                ) {

                    message.className =
                        "form-message error";

                    message.textContent =
                        "Password must contain at least 6 characters.";

                    return;

                }


                let users =
                    getUsers();


                /* EXISTING EMAIL */

                if (
                    users.some(
                        user =>
                            user.email === email
                    )
                ) {

                    message.className =
                        "form-message error";

                    message.textContent =
                        "An account with this email already exists.";

                    return;

                }


                /* CREATE USER */

                const user = {

                    id:
                        "user-" +
                        Date.now(),

                    name:
                        name,

                    email:
                        email,

                    password:
                        password,

                    role:
                        role,

                    status:
                        "active",

                    createdAt:
                        new Date().toISOString()

                };


                users.push(user);


                saveUsers(users);


                /* LOGIN SESSION */

                setSession({

                    id:
                        user.id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role,

                    status:
                        user.status,

                    createdAt:
                        user.createdAt

                });


                message.className =
                    "form-message success";


                /* ORGANIZER MESSAGE */

                if (
                    role === "organizer"
                ) {

                    message.textContent =
                        "Organizer account created. Opening Organizer Console…";

                } else {

                    message.textContent =
                        "Player account created. Entering the arena…";

                }


                /* REDIRECT */

                setTimeout(
                    () => {

                        if (
                            role ===
                            "organizer"
                        ) {

                            window.location.href =
                                "organizer/dashboard.html";

                        } else {

                            window.location.href =
                                "user/dashboard.html";

                        }

                    },
                    600
                );

            }
        );

    }


    /* =========================================
       LOGIN
       ========================================= */

    function setupLogin() {

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (!loginForm) return;


        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById(
                        "loginEmail"
                    ).value
                        .trim()
                        .toLowerCase();


                const password =
                    document.getElementById(
                        "loginPassword"
                    ).value;


                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                /* FIND USER */

                const user =
                    getUsers().find(
                        currentUser =>
                            currentUser.email ===
                            email &&
                            currentUser.password ===
                            password
                    );


                /* INVALID */

                if (!user) {

                    message.className =
                        "form-message error";

                    message.textContent =
                        "Invalid email or password.";

                    return;

                }


                /* BANNED */

                if (
                    user.status ===
                    "banned"
                ) {

                    message.className =
                        "form-message error";

                    message.textContent =
                        "This account is currently banned.";

                    return;

                }


                /* SAVE SESSION */

                setSession({

                    id:
                        user.id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role,

                    status:
                        user.status,

                    createdAt:
                        user.createdAt

                });


                message.className =
                    "form-message success";


                /* ROLE MESSAGE */

                if (
                    user.role ===
                    "admin"
                ) {

                    message.textContent =
                        "Admin login successful. Opening Admin Panel…";

                }

                else if (
                    user.role ===
                    "organizer"
                ) {

                    message.textContent =
                        "Organizer login successful. Opening Organizer Console…";

                }

                else {

                    message.textContent =
                        "Login successful. Entering the arena…";

                }


                /* REDIRECT */

                setTimeout(
                    () => {
                        redirectByRole(user);
                    },
                    500
                );

            }
        );

    }


    /* =========================================
       LOGOUT
       ========================================= */

    function setupLogout() {

        const logout =
            document.getElementById(
                "logoutBtn"
            );


        if (!logout) return;


        logout.addEventListener(
            "click",
            () => {

                clearSession();

                window.location.href =
                    "../login.html";

            }
        );

    }


    /* =========================================
       SIGNUP ROLE FROM URL
       Example:
       signup.html?role=organizer
       ========================================= */

    function setSignupRoleFromUrl() {

        const roleSelect =
            document.getElementById(
                "signupRole"
            );


        if (!roleSelect) return;


        const params =
            new URLSearchParams(
                window.location.search
            );


        const role =
            params.get("role");


        if (
            role ===
            "organizer"
        ) {

            roleSelect.value =
                "organizer";

        }

        else {

            roleSelect.value =
                "user";

        }

    }


    /* =========================================
       INITIALIZE
       ========================================= */

    ensureAdmin();

    setupPasswordToggles();

    setupSignup();

    setupLogin();

    setupLogout();

    setSignupRoleFromUrl();


    /* =========================================
       GLOBAL GAME AUTH OBJECT
       ========================================= */

    window.GameAuth = {

        getUsers,

        saveUsers,

        getSession,

        setSession,

        clearSession,

        redirectByRole,

        toast,

        requireAuth,

        ensureAdmin,

        USERS_KEY,

        SESSION_KEY,

        seedAdmin,

        seedOrganizer

    };


})();