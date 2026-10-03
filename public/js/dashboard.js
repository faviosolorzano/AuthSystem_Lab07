document.addEventListener(
    'DOMContentLoaded',
    async () => {

        if (!protectPage()) {
            return;
        }

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
                'userName'
            ).textContent =
                user.name;

        } catch (error) {

            console.error(error);
        }
    }
);