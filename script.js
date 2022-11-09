class Graph {
    constructor() {
        this.map = [];
        this.arrRibs = [];
    }
    addNewRib(vertex1, vertex2, TextLable, length) {
        if (this.arrRibs.find(i => i.vertex1 == vertex1 && i.vertex2 == vertex2) == undefined) {
            this.arrRibs.push({ vertex1, vertex2, TextLable, length })
        }
        if (this.map.indexOf(vertex1) == -1) { this.map.push(vertex1) }
        if (this.map.indexOf(vertex2) == -1) { this.map.push(vertex2) }
    }
    methodKruskala() {
        let LENGHT=0
        let ar = this.map.slice(0, this.map.length).map(i => [i])
        this.arrRibs.sort((a, b) => a.length - b.length)
        this.arrRibs.forEach(i => {
            let ia, ib
            ar.forEach((l, ll) => { if (l.indexOf(i.vertex1) != -1) { ia = ll } })
            ar.forEach((l, ll) => { if (l.indexOf(i.vertex2) != -1) { ib = ll } })
            if (ia != ib) {
                LENGHT+= +i.TextLable.innerText
                console.log(LENGHT);
                document.querySelector("#TextCount").textContent=`Мінімальна необхідна довжина кабелю  ${LENGHT}`
                drow(i.vertex1.left, i.vertex1.top, i.vertex2.left, i.vertex2.top, 'red', 3)
                ar[ia] = ar[ia].concat(ar[ib])
                ar[ib] = []
            }
        })
    }
}

let graph = new Graph()
let isCntrDown = false
let isAltDown = false
document.addEventListener('keydown', (e) => {
    isCntrDown = e.key == "Control"
    isAltDown = e.key == "Alt"
})
document.addEventListener('keyup', (e) => {
    isCntrDown = !e.key == "Control"
    isAltDown = !e.key == "Alt"
})
document.addEventListener('click', (e) => { isCntrDown && createNode(e) })

let focusNodeForMoving
document.addEventListener('mousemove', (e) => {
    if (focusNodeForMoving != null) {
        focusNodeForMoving.style.top = `${e.pageY - 10}px`
        focusNodeForMoving.style.left = `${e.pageX - 10}px`
        reDrouGraup();
    }
})

document.addEventListener('mouseup', (e) => { focusNodeForMoving = null })

let focusNode

function createNode(e) {
    let newNode = document.createElement("textarea")
    newNode.classList.add("vertex")
    newNode.style.top = `${e.pageY}px`
    newNode.style.left = `${e.pageX}px`
    document.body.appendChild(newNode)

    document.querySelectorAll("textarea").forEach(i => {
        i.addEventListener('mousedown', (e) => focusNodeForMoving = i)
        i.addEventListener('mouseup', (e) => focusNodeForMoving = null)
        i.onclick = (e) => {
            if (e.target.prox === undefined) e.target.prox = proxyng(e.target)
            
            let itemProcs= e.target.prox
            if (focusNode != null && isAltDown && focusNode != itemProcs) {

                isAltDown = false
                let leng = prompt("Введіть довжину...", 0)
                //console.log(itemProcs);
                let textLable = createTextLable(
                    focusNode.left - ((focusNode.left - itemProcs.left) / 2),
                    focusNode.top - ((focusNode.top - itemProcs.top) / 2), leng)
                graph.addNewRib(focusNode, itemProcs, textLable, leng)
                drow(focusNode.left, focusNode.top, itemProcs.left, itemProcs.top, 'green', 3)
                graph.methodKruskala();
            }
            focusNode = itemProcs
        }
    })
}
function proxyng(targ) {
    targ.isProxy = true;
    return new Proxy(targ, {
        get(target, prop, receiver) {
            if (prop == "left") return parseInt(target["style"].left)
            if (prop == "top") return parseInt(target["style"].top)
            return target[prop]
        }
    })
}

function createTextLable(x, y, lenght) {
    let newNode = document.createElement("div")
    newNode.classList.add("textLenght")
    newNode.style.top = `${y}px`
    newNode.style.left = `${x}px`
    newNode.innerText = lenght;
    document.body.appendChild(newNode)
    return proxyng(newNode)
}

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d');

function reDrouGraup() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.arrRibs.forEach(i => {
        drow(i.vertex1.left, i.vertex1.top, i.vertex2.left, i.vertex2.top, 'green', 3)
        i.TextLable.style.left = `${i.vertex1.left - ((i.vertex1.left - i.vertex2.left) / 2)}px`
        i.TextLable.style.top = `${i.vertex1.top - ((i.vertex1.top - i.vertex2.top) / 2)}px`
    })
    graph.methodKruskala();
}

function drow(x1, y1, x2, y2, strokeS, lineW) {
    ctx.strokeStyle = strokeS;
    ctx.lineWidth = lineW;
    ctx.beginPath();
    ctx.moveTo(x1 + 15, y1+10 );
    ctx.lineTo(x2 + 15, y2+10 );
    ctx.closePath();
    ctx.stroke();
}