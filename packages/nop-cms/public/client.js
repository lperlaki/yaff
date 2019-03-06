const section = document.getElementById('cms')

const api = section.getAttribute('data-api')

function string2html(string) {
    let template = document.createElement('template');
    template.innerHTML = string.trim();
    return template.content;
}

async function inserArticle(id) {
    let string = await fetch(api + id).then(r => r.text())
    section.appendChild(string2html(string))
}

async function loadArticles() {
    let articles = await fetch(api).then(r => r.json())
    for (let a of articles) {
        inserArticle(a)
    }
}

loadArticles()