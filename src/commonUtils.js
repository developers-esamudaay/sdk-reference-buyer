export const delay = (time) => {
  return new Promise((resolve, reject) => {
    if (time) {
      setTimeout(() => resolve(), time)
    } else {
      reject('time is not defined')
    }
  })
}
export const isEmptyObject=(obj)=>Object.keys(obj).length===0