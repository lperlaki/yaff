const express = require('express')
const markdown = require("markdown").markdown
const app = express()
const port = process.env.PORT || 3000
const dbUrl = process.env.DB_URL



const db = {
    test: {
        text: `
# Header

my nice text

1. Test
2. Hello Workd
* Hi

some code for youe
`,
        date: '2018-09-20',
        title: 'Test',
        author: 'Liam PErlaki',
    }
}


app.use(express.static('public'))

app.get('/article', (req, res) => res.json(['test']))

app.get('/article/:id', (req, res) => {
    let id = req.params.id
    let article = db[id]
    let html = `<article><header>${article.title}<time>${article.date}</time></header>${markdown.toHTML(article.text)}</article>`
    res.send(html)
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))