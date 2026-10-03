document.addEventListener(
    'DOMContentLoaded',
    async () => {

        if (!protectPage()) {
            return;
        }

        await loadProfile();

        const form =
            document.getElementById(
                'profileForm'
            );

        form.addEventListener(
            'submit',
            updateProfile
        );
    }
);

async function loadProfile() {

    const token =
        getToken();

    try {

        const response =
            await fetch(
                '/api/users/me',
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

        const user =
            await response.json();

        document.getElementById(
            'name'
        ).value =
            user.name || '';

        document.getElementById(
            'lastName'
        ).value =
            user.lastName || '';

        document.getElementById(
            'email'
        ).value =
            user.email || '';

        document.getElementById(
            'phoneNumber'
        ).value =
            user.phoneNumber || '';

        document.getElementById(
            'birthdate'
        ).value =
            user.birthdate
                ? user.birthdate.substring(0, 10)
                : '';

        document.getElementById(
            'age'
        ).value =
            user.age || '';

        document.getElementById(
            'url_profile'
        ).value =
            user.url_profile || '';

        document.getElementById(
            'adress'
        ).value =
            user.adress || '';

        document.getElementById(
            'roles'
        ).innerHTML =
            user.roles
                .map(role =>
                    `<span class="chip">
                        ${role}
                    </span>`
                )
                .join('');

        M.updateTextFields();

    } catch (error) {

        console.error(error);
    }
}

async function updateProfile(event) {

    event.preventDefault();

    const token =
        getToken();

    const message =
        document.getElementById(
            'message'
        );

    const data = {

        name:
            document.getElementById(
                'name'
            ).value,

        lastName:
            document.getElementById(
                'lastName'
            ).value,

        phoneNumber:
            document.getElementById(
                'phoneNumber'
            ).value,

        birthdate:
            document.getElementById(
                'birthdate'
            ).value,

        url_profile:
            document.getElementById(
                'url_profile'
            ).value,

        adress:
            document.getElementById(
                'adress'
            ).value
    };

    try {

        const response =
            await fetch(
                '/api/users/me',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type':
                            'application/json',
                        Authorization:
                            `Bearer ${token}`
                    },
                    body:
                        JSON.stringify(data)
                }
            );

        if (
            response.status === 401
        ) {
            logout();
            return;
        }

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                'No se pudo actualizar'
            );
        }

        message.innerHTML =
            '<span class="green-text">' +
            'Datos actualizados correctamente' +
            '</span>';

        M.updateTextFields();

    } catch (error) {

        message.innerHTML =
            `<span class="red-text">
                ${error.message}
            </span>`;
    }
}