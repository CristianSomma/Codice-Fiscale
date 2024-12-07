

reader.readAsText()

document.getElementById('fileInput').addEventListener('change', (evt) => {
    const file = evt.target.files[0];

    const reader = new FileReader();
    let str = '[';

    reader.onload = function (evt) {
        txt = evt.target.result;
        console.log(txt)
    }

    console.log(reader.readAsText(file))
})