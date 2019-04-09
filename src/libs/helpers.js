/**
 * debounce
 *
 * @param {Func} fn
 * @param {Time} time
 */
const debounce = (fn, time = 300) => {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, ...args)
    }, time)
  }
}

export { debounce }
