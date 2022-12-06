import axios from 'axios'
enum RequestType {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}
enum ResponseStatus {
  Success200,
  Error404,
  Error500,
  Error401,
  DefaultValue,
  Offline,
}
class ApiClient {
  static async request({ params, url, requestType }) {
    try {
      const axoisInstance = axios.create({
        baseURL: 'https://api.test.esamudaay.com',
        timeout: 1000,
        headers: { apid: `047e050e-59dd-4b55-8403-392c396bc59a` },
      })

      switch (requestType) {
        case RequestType.GET:
          return await axoisInstance.get(url).then((response) => response)

        case RequestType.POST: {
          console.log(params)
          return await axoisInstance.post(url, params).then((response) => response)
        }

        case RequestType.PUT:
          return await axoisInstance.put(url, params).then((response) => response)

        case RequestType.PATCH:
          return await axoisInstance.patch(url, params).then((response) => response)

        case RequestType.DELETE:
          return await axoisInstance.delete(url, params).then((response) => response)
      }
    } catch (e) {
      return {}
    }
  }
}
export default ApiClient
