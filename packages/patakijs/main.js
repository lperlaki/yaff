function t(strings, ...args) { //template tag
    if (typeof window === 'undefined') return `${stitch(strings, args)}`
    let temp = document.createElement('template')
    temp.innerHTML = stitch(strings, args)
    return temp.content
}


function stitch(strings, args) {
    if (strings.length === 0) return strings[0]
    let string = strings[0]
    for (let i = 0; i < args.length; i++) {
        string += `<slot>${args[i]}</slot>${strings[i+1]}`
    }
    return string
}


console.log(t `test`)

// user code