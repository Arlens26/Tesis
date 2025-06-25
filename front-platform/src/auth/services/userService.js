const BASE_URL = import.meta.env.VITE_API_BASE_URL

const AUTH_ENDPOINT = `${BASE_URL}/authentication/user/login/`
const PROFILE_ENDPOINT = `${BASE_URL}/authentication/user/profile/`
const LOGOUT_ENDPOINT = `${BASE_URL}/authentication/user/logout/`

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