const formToObj = (element) => [...(new FormData(element)).entries()].reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj
}, {});


async function submitForm(event) {
    event.preventDefault()
    try {
        const method = this.method.toUpperCase()
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json,text/plain; charset=utf-8'
            },
        }

        if (method != 'GET') {
            options.body = JSON.stringify(formToObj(this))
        }

        this.dispatchEvent(new CustomEvent('success', {
            detail: {
                response: await fetch(this.action, options),
            },
            bubbles: true,
            cancelable: true
        }))
    } catch (error) {
        this.dispatchEvent(new ErrorEvent('formSubmit', {
            error: error,
            message: 'Something went wrong'
        }))
    }
}

export default function registerForm(selector, success) {
    const el = document.querySelector(selector)
    el.addEventListener('submit', submitForm)
    success && el.addEventListener('success', (e) => {
        success(e.detail.response)
    })
}

if (window) window.registerForm = registerForm