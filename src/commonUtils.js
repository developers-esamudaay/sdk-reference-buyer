export const delay = (time) => {
  return new Promise((resolve, reject) => {
    if (time) {
      setTimeout(() => resolve(), time)
    } else {
      reject('time is not defined')
    }
  })
}
