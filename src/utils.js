function stringToHTML(string, ...vars) {
    const temp = document.createElement('template')
    temp.innerHTML = string.map((e, i) => `${e}${vars[i]||''}`).join('')
    return temo.content
}