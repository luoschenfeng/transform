const a = (value) => {
    const arr = Array.from({length: 2}, (item) => item * value )
    const dom = document.createElement('div')
    dom.innerText = arr
    document.body.appendChild(dom)
} 

a(10)