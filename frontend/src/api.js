import axios from 'axios'

// Todas las llamadas van al backend
const api = axios.create({ baseURL: 'http://localhost:5054/api' })

// Manda el JWT guardado en cada pedido
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el token venció (401), se cierra la sesión
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// Formato en pesos argentinos
export const moneda = (valor) =>
  Number(valor).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })

// Mensaje de error que manda la API
export const textoError = (error) => {
  if (error.response?.status === 403) return 'No tenés permiso para hacer esto'
  return error.response?.data?.mensaje ?? error.response?.data?.title ?? 'Ocurrió un error'
}

export default api
