function createNewCode(event){
    event.preventDefault();
}

function mainpulateSurname(){
    const input = document.getElementById('surname').value;
    const surname = input.toUpperCase();

    const consonants = [
        'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
    ]

    for(let char of surname){
        if(consonants.includes(char)){
            
        }
    }
}