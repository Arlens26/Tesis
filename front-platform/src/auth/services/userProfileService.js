const BASE_URL = import.meta.env.VITE_API_BASE_URL

const GET_PROFILE_ENDPOINT = `${BASE_URL}/authentication/user/get_profile/`
const UPDATE_PROFILE_ENDPOINT = `${BASE_URL}/authentication/user/update_profile/`
const CHANGE_PASSWORD_ENDPOINT = `${BASE_URL}/authentication/user/change_password/`

export const getUserProfile = async (token) => {
    try {
        const response = await fetch(GET_PROFILE_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Error en getUserProfile:', error)
        throw error
    }
}

export const updateUserProfile = (profileData, token) => {
    return fetch(UPDATE_PROFILE_ENDPOINT, {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el perfil')
        }
        return response.json()
    })
}

export const changePassword = (passwordData, token) => {
    return fetch(CHANGE_PASSWORD_ENDPOINT, {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cambiar la contraseña')
        }
        return response.json()
    })
}
