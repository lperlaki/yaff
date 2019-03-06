function stitch(strings, args) {
    if (strings.length === 0) return strings[0]
    let string = strings[0]
    for (let i = 0; i < args.length; i++) {
        string += `\${a[${args[i]}]}${strings[i+1]}`
    }
    return string
}


function s(strings, ...args) {
    return (...a) => stitch(strings, args)
}


let b = s `Hello Worls${0} Test`

console.log(b('Test'))