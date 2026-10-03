function getToken() {
    return sessionStorage.getItem('token');
}

function getRoles() {
    return JSON.parse(
        sessionStorage.getItem('roles') || '[]'
    );
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    window.location.href = '/signIn';
}

function isTokenExpired(token) {

    try {

        const payload =
            JSON.parse(
                atob(
                    token.split('.')[1]
                )
            );

        return payload.exp * 1000 <
            Date.now();

    } catch {
        return true;
    }
}

function protectPage() {

    const token = getToken();

    if (!token || isTokenExpired(token)) {
        logout();
        return false;
    }

    return true;
}

async function signIn(event) {

    event.preventDefault();

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;

    const message =
        document.getElementById('message');

    message.textContent = '';

    try {

        const response =
            await fetch('/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                'Error al iniciar sesión'
            );
        }

        sessionStorage.setItem(
            'token',
            data.token
        );

        sessionStorage.setItem(
            'roles',
            JSON.stringify(data.roles)
        );

        if (data.roles.includes('admin')) {
            window.location.href = '/admin';
        } else {
            window.location.href = '/dashboard';
        }

    } catch (error) {

        message.textContent =
            error.message;
    }
}

async function signUp(event) {

    event.preventDefault();

    const message =
        document.getElementById('message');

    message.textContent = '';

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

        email:
            document.getElementById(
                'email'
            ).value,

        password:
            document.getElementById(
                'password'
            ).value
    };

    try {

        const response =
            await fetch(
                '/api/auth/signUp',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body:
                        JSON.stringify(data)
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                'Error al registrarse'
            );
        }

        M.toast({
            html:
                'Registro exitoso'
        });

        setTimeout(() => {
            window.location.href =
                '/signIn';
        }, 1000);

    } catch (error) {

        message.textContent =
            error.message;
    }
}

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const signInForm =
            document.getElementById(
                'signInForm'
            );

        if (signInForm) {
            signInForm.addEventListener(
                'submit',
                signIn
            );
        }

        const signUpForm =
            document.getElementById(
                'signUpForm'
            );

        if (signUpForm) {
            signUpForm.addEventListener(
                'submit',
                signUp
            );
        }

        const adminNav =
            document.getElementById(
                'adminNav'
            );

        const adminNavMobile =
            document.getElementById(
                'adminNavMobile'
            );

        if (
            !getRoles().includes('admin')
        ) {

            if (adminNav)
                adminNav.style.display =
                    'none';

            if (adminNavMobile)
                adminNavMobile.style.display =
                    'none';
        }

        const sidenav =
            document.querySelectorAll(
                '.sidenav'
            );

        if (sidenav.length) {
            M.Sidenav.init(sidenav);
        }
    }
);