import ApiClient from './ApiClient.ts'
import { RequestType } from '../Constant.ts'
import Urls from './Url'
import { getAllDocs } from './firbaseOperations'
export const getAllOndcCatatlog = async () => {
  const allDocs = await getAllDocs()
  allDocs.forEach((doc) => {
    console.log(doc)
  })
}
