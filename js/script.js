function parralax(e, obj) {
    let clientWidth = document.documentElement.clientWidth;
    let clientHeight = document.documentElement.clientHeight;

    if(clientWidth <= 768) { return; }

    let moveX = -((clientWidth / 2) - e.clientX) / 30;
    let moveY = -((clientHeight / 2) - e.clientY) / 30;
    
    obj.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

let knight = document.getElementById("knight");
document.addEventListener("mousemove", e => (parralax(e, knight)));
