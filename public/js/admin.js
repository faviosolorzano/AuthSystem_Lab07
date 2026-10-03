let users = [];

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        if (!protectPage()) {
            return;
        }

        const roles =
            getRoles();

        if (!roles.includes('admin')) {

            window.location.href =
                '/403';

            return;
        }

        const modal =
            document.getElementById(
                'userModal'
            );

        M.Modal.init(modal);

        await loadUsers();
    }
);

async function loadUsers() {

    const token =
        getToken();

    try {

        const response =
            await fetch(
                '/api/users',
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        if (
            response.status === 401
        ) {
            logout();
            return;
        }

        if (
            response.status === 403
        ) {
            window.location.href =
                '/403';
            return;
        }

        users =
            await response.json();

        document.getElementById(
            'totalUsers'
        ).textContent =
            users.length;

        const table =
            document.getElementById(
                'usersTable'
            );

        table.innerHTML =
            users.map(
                (user, index) => `

                <tr>

                    <td>
                        ${user.name}
                        ${user.lastName}
                    </td>

                    <td>
                        ${user.email}
                    </td>

                    <td>
                        ${user.phoneNumber}
                    </td>

                    <td>
                        ${user.roles.join(', ')}
                    </td>

                    <td>
                        ${formatDate(
                            user.createdAt
                        )}
                    </td>

                    <td>

                        <button
                            class="btn-small blue"
                            onclick="viewUser(${index})">

                            <i class="material-icons">
                                visibility
                            </i>

                        </button>

                    </td>

                </tr>
            `
            ).join('');

    } catch (error) {

        console.error(error);
    }
}

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            'es-PE',
            {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        );
}

function viewUser(index) {

    const user =
        users[index];

    document.getElementById(
        'userDetails'
    ).innerHTML = `

        <p>
            <strong>Nombre:</strong>
            ${user.name}
            ${user.lastName}
        </p>

        <p>
            <strong>Email:</strong>
            ${user.email}
        </p>

        <p>
            <strong>Teléfono:</strong>
            ${user.phoneNumber}
        </p>

        <p>
            <strong>Fecha de nacimiento:</strong>
            ${user.birthdate.substring(0, 10)}
        </p>

        <p>
            <strong>Edad:</strong>
            ${user.age}
        </p>

        <p>
            <strong>Dirección:</strong>
            ${user.adress || 'No registrada'}
        </p>

        <p>
            <strong>Perfil:</strong>
            ${user.url_profile || 'No registrado'}
        </p>

        <p>
            <strong>Rol:</strong>
            ${user.roles.join(', ')}
        </p>

        <p>
            <strong>Fecha de registro:</strong>
            ${formatDate(user.createdAt)}
        </p>
    `;

    const modal =
        M.Modal.getInstance(
            document.getElementById(
                'userModal'
            )
        );

    modal.open();
}