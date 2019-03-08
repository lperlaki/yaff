export function html(string, ...vars) {
    const temp = document.createElement('template')
    temp.innerHTML = string.map((e, i) => `${e}${vars[i]||''}`).join('')
    return temo.content
}

export function h(s, ...v) {
    const temp = document.createElement('template');
    temp.innerHTML = s.join('<store-wrapper>');
    const content = document.importNode(temp.content, true);
    content.querySelectorAll('store-wrapper').forEach((el, i) => {
        el.state = v[i]
    })
    return content
}

import {
    define
} from './stateWrapper';
if (window) {
    define();
    window.html = html;
    window.h = h;
}