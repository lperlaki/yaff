# Formax

> Submit Forms with Ajax

index.html

```html
<html>
<head>
    <script defer src="//unpkg.com/formax"></script>
    <script defer src="main.js"></script>
</head>
<body>
    <form id="getDog" action="https://dog.ceo/api/breeds/image/random" method="GET">
            <button>Get Dogs</button>
    </form>
</body>
</html>
```

main.js

```js
registerForm("form#getDog", async res => {
  console.log(await res.json());
});
```
