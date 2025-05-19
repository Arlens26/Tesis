const AUTH_ENDPOINT = `http://127.0.0.1:8000/authentication/user/login/`
const PROFILE_ENDPOINT = `http://127.0.0.1:8000/authentication/user/profile/`
const LOGOUT_ENDPOINT = `http://127.0.0.1:8000/authentication/user/logout/`

export const loginUser = (fields) => {
    return fetch(AUTH_ENDPOINT, {
        method: 'POST', 
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(fields)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del usuario')
        }
        return response.json()
    })
}

export const userProfile = (token) => {
    return fetch(PROFILE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el perfil del usuario');
        }
        return response.json()
    })
}

export const logoutUser = (token) => {
    return fetch(LOGOUT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cerrar sesión')
        }
        return response.json()
    })
}