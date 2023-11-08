import { cloudFunctionServerUrl } from '../../common/serverUrl'
import axios from 'axios'

export const getDriverAvailable = async (
  latitude,
  longitude,
  carType = null
) => {
  try {
    let params = `latitude=${latitude}&longitude=${longitude}`

    if (carType) {
      params += `&carType=${carType}`
    }

    const { data: response } = await axios.get(
      `${cloudFunctionServerUrl}/api/v1/driver/available?${params}`
    )

    return response
  } catch (err) {
    let error = err
    let messageError = 'Não fo possível processar solicitação'

    if (err.response && err.response.data) {
      error = err.response.data
      if (error.message) {
        messageError = error.message
      }
    }

    console.log('Err getDriverAvailable', messageError)
    return {
      status: false,
      message: messageError
    }
  }
}
