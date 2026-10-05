```javascript
(function () {

    const page = document.body.dataset.page;

    const session =
        window.GameAuth?.requireAuth("organizer");

    if (!session) return;

    const ORG_ID = session.id;


    /* =========================================
       GET ORGANIZER TOURNAMENTS
       ========================================= */

    function myTournaments() {

        return window.GameTournaments
            .get()
            .filter(
                t =>
                    !t.organizerId ||
                    t.organizerId === ORG_ID ||
                    t.organizerId === "org-001"
            );

    }


    /* =========================================
       SAVE TOURNAMENTS
       ========================================= */

    function saveTournamentList(data) {

        window.GameTournaments.save(data);

    }


    /* =========================================
       ORGANIZER DASHBOARD
       ========================================= */

    function renderDashboard() {

        const tournaments =
            myTournaments();

        const regs =
            window.GameTournaments
                .getRegs()
                .filter(
                    r =>
                        tournaments.some(
                            t =>
                                t.id === r.tournamentId
                        )
                );


        const today =
            new Date()
                .toISOString()
                .slice(0, 10);


        document.getElementById(
            "orgTournaments"
        ).textContent =
            tournaments.length;


        document.getElementById(
            "orgRegistrations"
        ).textContent =
            regs.length;


        document.getElementById(
            "orgUpcoming"
        ).textContent =
            tournaments.filter(
                t =>
                    t.date >= today &&
                    t.status !== "Completed"
            ).length;


        document.getElementById(
            "orgPlayers"
        ).textContent =
            new Set(
                regs.map(
                    r => r.userEmail
                )
            ).size;


        const list =
            tournaments
                .slice()
                .sort(
                    (a, b) =>
                        a.date.localeCompare(b.date)
                )
                .slice(0, 6);


        document.getElementById(
            "organizerTournamentList"
        ).innerHTML =

            list.map(
                t => `

                <div class="admin-row">

                    <div>

                        <strong>
                            ${window.GameTournaments.escapeHtml(t.name)}
                        </strong>

                        <span>
                            ${t.game}
                            •
                            ${window.GameTournaments.formatDate(t.date)}
                            •
                            ${window.GameTournaments.formatTime(t.time)}
                        </span>

                    </div>


                    <span class="status-${String(
                        t.status || "Upcoming"
                    ).toLowerCase()}">

                        ${String(
                            t.status || "Upcoming"
                        ).toUpperCase()}

                    </span>


                    <span>
                        ${window.GameTournaments.registrationCount(t.id)}
                        /
                        ${t.slots}
                        players
                    </span>


                    <div class="admin-row-actions">

                        <a
                            class="mini-btn"
                            href="tournaments.html"
                        >
                            Manage
                        </a>

                    </div>

                </div>

            `
            ).join("")

            ||

            '<div class="loading">No tournaments available.</div>';

    }


    /* =========================================
       OPEN MODAL
       ========================================= */

    function openModal(item) {

        const modal =
            document.getElementById(
                "tournamentModal"
            );

        if (!modal) return;


        modal.classList.add("open");


        document.getElementById(
            "modalTitle"
        ).textContent =
            item
                ? "Edit Tournament"
                : "Create Tournament";


        document.getElementById(
            "editId"
        ).value =
            item?.id || "";


        document.getElementById(
            "tName"
        ).value =
            item?.name || "";


        document.getElementById(
            "tGame"
        ).value =
            item?.game || "Call of Duty";


        document.getElementById(
            "tType"
        ).value =
            item?.type || "Free";


        document.getElementById(
            "tDate"
        ).value =
            item?.date || "";


        document.getElementById(
            "tTime"
        ).value =
            item?.time || "19:00";


        document.getElementById(
            "tPrize"
        ).value =
            item?.prize || "₹5,000";


        document.getElementById(
            "tSlots"
        ).value =
            item?.slots || 100;


        document.getElementById(
            "tStatus"
        ).value =
            item?.status || "Upcoming";


        document.getElementById(
            "tDescription"
        ).value =
            item?.description || "";

    }


    /* =========================================
       CLOSE MODAL
       ========================================= */

    function closeModal() {

        document
            .getElementById("tournamentModal")
            ?.classList.remove("open");

    }


    /* =========================================
       RENDER TOURNAMENT TABLE
       ========================================= */

    function renderTournaments() {

        const wrap =
            document.getElementById(
                "organizerTournamentTable"
            );

        if (!wrap) return;


        const tournaments =
            myTournaments();


        wrap.innerHTML = `

            <table>

                <thead>

                    <tr>

                        <th>Tournament</th>
                        <th>Game</th>
                        <th>Schedule</th>
                        <th>Status</th>
                        <th>Players</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        tournaments.map(
                            x => `

                            <tr>

                                <td>

                                    <strong>
                                        ${window.GameTournaments.escapeHtml(x.name)}
                                    </strong>

                                    <br>

                                    <small>
                                        ${window.GameTournaments.escapeHtml(x.type)}
                                    </small>

                                </td>


                                <td>
                                    ${x.game}
                                </td>


                                <td>

                                    ${window.GameTournaments.formatDate(x.date)}

                                    <br>

                                    ${window.GameTournaments.formatTime(x.time)}

                                </td>


                                <td
                                    class="status-${String(
                                        x.status || "Upcoming"
                                    ).toLowerCase()}"
                                >

                                    ${String(
                                        x.status || "Upcoming"
                                    ).toUpperCase()}

                                </td>


                                <td>

                                    ${window.GameTournaments.registrationCount(x.id)}
                                    /
                                    ${x.slots}

                                </td>


                                <td>

                                    <div class="table-actions">

                                        <button
                                            class="mini-btn edit-organizer"
                                            data-id="${x.id}"
                                        >
                                            Edit
                                        </button>


                                        <button
                                            class="mini-btn danger delete-organizer"
                                            data-id="${x.id}"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        `
                        ).join("")

                        ||

                        `
                        <tr>

                            <td colspan="6">
                                No tournaments available.
                                Create your first tournament.
                            </td>

                        </tr>
                        `
                    }

                </tbody>

            </table>

        `;

    }


    /* =========================================
       TOURNAMENT PAGE
       ========================================= */

    function setupTournamentPage() {

        renderTournaments();


        document
            .getElementById("openCreateBtn")
            .addEventListener(
                "click",
                () => openModal()
            );


        document
            .getElementById("closeModal")
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById("cancelModal")
            .addEventListener(
                "click",
                closeModal
            );


        document
            .getElementById("tournamentModal")
            .addEventListener(
                "click",
                e => {

                    if (
                        e.target.id ===
                        "tournamentModal"
                    ) {

                        closeModal();

                    }

                }
            );


        /* SAVE TOURNAMENT */

        document
            .getElementById("tournamentForm")
            .addEventListener(
                "submit",
                e => {

                    e.preventDefault();


                    const id =
                        document.getElementById(
                            "editId"
                        ).value;


                    const all =
                        window.GameTournaments.get();


                    const old =
                        id
                            ? all.find(
                                x => x.id === id
                            )
                            : null;


                    const item = {

                        id:
                            id ||
                            "t-" +
                            Date.now(),

                        name:
                            document.getElementById(
                                "tName"
                            ).value.trim(),

                        game:
                            document.getElementById(
                                "tGame"
                            ).value,

                        type:
                            document.getElementById(
                                "tType"
                            ).value,

                        date:
                            document.getElementById(
                                "tDate"
                            ).value,

                        time:
                            document.getElementById(
                                "tTime"
                            ).value,

                        prize:
                            document.getElementById(
                                "tPrize"
                            ).value.trim(),

                        slots:
                            Number(
                                document.getElementById(
                                    "tSlots"
                                ).value
                            ),

                        status:
                            document.getElementById(
                                "tStatus"
                            ).value,

                        description:
                            document.getElementById(
                                "tDescription"
                            ).value.trim(),

                        organizerId:
                            old?.organizerId ||
                            ORG_ID,

                        createdAt:
                            old?.createdAt ||
                            new Date().toISOString()

                    };


                    if (id) {

                        const index =
                            all.findIndex(
                                x => x.id === id
                            );

                        if (index > -1) {

                            all[index] =
                                item;

                        }

                    }
                    else {

                        all.push(item);

                    }


                    saveTournamentList(all);


                    window.GameAuth.toast(
                        id
                            ? "Tournament updated."
                            : "Tournament created."
                    );


                    closeModal();


                    renderTournaments();

                }
            );


        /* EDIT / DELETE */

        document
            .getElementById(
                "organizerTournamentTable"
            )
            .addEventListener(
                "click",
                e => {

                    const edit =
                        e.target.closest(
                            ".edit-organizer"
                        );


                    const del =
                        e.target.closest(
                            ".delete-organizer"
                        );


                    if (edit) {

                        const item =
                            myTournaments().find(
                                x =>
                                    x.id ===
                                    edit.dataset.id
                            );


                        openModal(item);

                    }


                    if (del) {

                        if (
                            !confirm(
                                "Delete this tournament and its registrations?"
                            )
                        ) {
                            return;
                        }


                        const id =
                            del.dataset.id;


                        saveTournamentList(
                            window.GameTournaments
                                .get()
                                .filter(
                                    x => x.id !== id
                                )
                        );


                        window.GameTournaments.saveRegs(
                            window.GameTournaments
                                .getRegs()
                                .filter(
                                    r =>
                                        r.tournamentId !==
                                        id
                                )
                        );


                        window.GameAuth.toast(
                            "Tournament deleted."
                        );


                        renderTournaments();

                    }

                }
            );

    }


    /* =========================================
       REGISTRATIONS
       ========================================= */

    function renderRegistrations() {

        const select =
            document.getElementById(
                "registrationTournament"
            );


        const wrap =
            document.getElementById(
                "registrationTable"
            );


        if (!select || !wrap) return;


        const tournaments =
            myTournaments();


        select.innerHTML =

            '<option value="all">All my tournaments</option>' +

            tournaments.map(
                t =>
                    `<option value="${t.id}">
                        ${window.GameTournaments.escapeHtml(t.name)}
                    </option>`
            ).join("");


        function draw() {

            const id =
                select.value;


            const allowed =
                new Set(
                    tournaments.map(
                        t => t.id
                    )
                );


            const regs =
                window.GameTournaments
                    .getRegs()
                    .filter(
                        r =>
                            allowed.has(
                                r.tournamentId
                            ) &&
                            (
                                id === "all" ||
                                r.tournamentId === id
                            )
                    );


            wrap.innerHTML = `

                <table>

                    <thead>

                        <tr>

                            <th>Player</th>
                            <th>Email</th>
                            <th>Tournament</th>
                            <th>Registered</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            regs.map(
                                r => {

                                    const t =
                                        tournaments.find(
                                            x =>
                                                x.id ===
                                                r.tournamentId
                                        );


                                    return `

                                        <tr>

                                            <td>

                                                <strong>
                                                    ${window.GameTournaments.escapeHtml(r.userName)}
                                                </strong>

                                            </td>


                                            <td>
                                                ${window.GameTournaments.escapeHtml(r.userEmail)}
                                            </td>


                                            <td>
                                                ${window.GameTournaments.escapeHtml(
                                                    t?.name ||
                                                    "Unknown"
                                                )}
                                            </td>


                                            <td>

                                                ${new Date(
                                                    r.registeredAt
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        dateStyle:
                                                            "medium",
                                                        timeStyle:
                                                            "short"
                                                    }
                                                )}

                                            </td>


                                            <td>

                                                <button
                                                    class="mini-btn danger remove-registration"
                                                    data-id="${r.id}"
                                                >
                                                    Remove
                                                </button>

                                            </td>

                                        </tr>

                                    `;

                                }
                            ).join("")

                            ||

                            `
                            <tr>
                                <td colspan="5">
                                    No registrations found.
                                </td>
                            </tr>
                            `
                        }

                    </tbody>

                </table>

            `;

        }


        select.addEventListener(
            "change",
            draw
        );


        draw();


        wrap.addEventListener(
            "click",
            e => {

                const btn =
                    e.target.closest(
                        ".remove-registration"
                    );


                if (!btn) return;


                if (
                    !confirm(
                        "Remove this player from the tournament?"
                    )
                ) {
                    return;
                }


                window.GameTournaments.saveRegs(
                    window.GameTournaments
                        .getRegs()
                        .filter(
                            r =>
                                r.id !==
                                btn.dataset.id
                        )
                );


                window.GameAuth.toast(
                    "Registration removed."
                );


                draw();

            }
        );

    }


    /* =========================================
       PAGE INITIALIZATION
       ========================================= */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            if (
                page ===
                "organizer-dashboard"
            ) {

                renderDashboard();

            }


            if (
                page ===
                "organizer-tournaments"
            ) {

                setupTournamentPage();

            }


            if (
                page ===
                "organizer-registrations"
            ) {

                renderRegistrations();

            }

        }
    );

})();
```