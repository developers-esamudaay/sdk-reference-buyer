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
export const debouncedFunction=(fn,delay)=>{
  let timer;
  return (...args)=>{
    console.log(timer)
    timer&&clearTimeout(timer)
    timer=setTimeout(()=>fn(...args),delay)

  }
}