// @ts-nocheck
function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result
    return function() {
        context = this
        args = arguments
        timestamp = new Date()
        let later = function() {
            let last = (new Date()) - timestamp
            if (last < wait) {
                timeout = setTimeout(later, wait - last)
            } else {
                timeout = null
                if (!immediate) result = func.apply(context, args)
            }
        }
        let callNow = immediate && !timeout
        if (!timeout) {
            timeout = setTimeout(later, wait)
        }
        if (callNow) result = func.apply(context, args)
        return result
    }
}

export default debounce