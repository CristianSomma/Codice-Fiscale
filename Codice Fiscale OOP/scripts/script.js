function sendForm(event){
    // Prevengo il ricaricamento della pagina all'invio del form
    event.preventDefault();
    let finalResult = ''

    namesChecker([document.getElementById('name'), document.getElementById('surname')])
}

// Constructor che crea un oggetto User personalizzato
class User {
    // Proprietà dell'oggetto:
    constructor() {
        this.name;
        this.surname;
        this.birthDate;
        this.gender;
        this.generatePersonalCode = () => {
            let finalResult = '';
            finalResult += namesManipulator(this.name);
            finalResult += namesManipulator(this.surname);
            finalResult += dateManipulator(this.birthDate);
            console.log(finalResult)
        }
    }

    // Setters per le proprietà:
    // Prima di passare gli input ne controllo tramite apposite funzioni la validità    
    set setName(input) {
        this.name = namesChecker(input);
    }

    set setSurname(input) {
        this.surname = namesChecker(input);
    }

    set setBirthDate(input) {
        this.birthDate = dateChecker(input);
    }

    set setGender(input) {
        this.gender = genderChecker(input);
    }
}

// Controllo validità di input name e surname
function namesChecker(input) {
    // Uso regex per ricercare un pattern specifico nella stringa di input
    // Regex: \w+ (parole), \s? (spazio opzionale)
    const checkRegex = /\w+\s?/g
    // Uso test() per cercare il pattern nella stringa
    if(checkRegex.test(input.value)){
        // Se pattern ritrovato nella stringa allora viene ritornato il valore e poi assegnato a this.name
        return input.value;
    }else{
        // Se non è ritrovato il pattern allora il bordo del campo input diventa rosso
        input.style.borderColor = 'red';
        alert('Inserire un testo valido.\nSono ammesse unicamente lettere e spazi.');
        input.value = '';
    }
}

function dateChecker(input) {
    // Creo un'istanza dell'oggetto Date
    let todayDate = new Date();
    // Array che contiene l'anno, il mese e il giorno di oggi
    // getMonth() ritorna il mese da 0 a 11 quindi aggiungo 1 per avere un valore valido.
    const today = [todayDate.getFullYear(), todayDate.getMonth()+1, todayDate.getDate()]
    // Creo un array che contiene l'anno, il mese e il giorno selezionati dall'utente
    const birth = input.value.split('-');

    // CORREGGERE:
    // CONTROLLARE SE ANNOi > ANNOo
    // SE UGUALI CONTROLLARE MESEi > MESEo
    // SE UGUALI CONTROLLARE GIORNOi > GIORNOo
    birth.forEach((element, index) => {
        element = parseInt(element);

        if(element > parseInt(today[index])){
            input.style.borderColor = 'red';
            alert('Inserire una data passata.');
            input.value = '';
            return;
        }

    });

    // Ritorno l'array della data scelta dall'utente
    return birth;
}

function genderChecker(input) {
    // Se viene selezionata l'opzione nulla da' errore
    if(input.value === 'none'){
        input.style.borderColor = 'red';
        alert('Inserire un valore valido nel campo "Sesso".');
        input.value = '';
    }else{
        return input.value;
    }
}



function namesManipulator(value){
    let result = '';

    console.log(value)
    // Transformo la stringa in maiuscolo
    value = value.toUpperCase();
    
    for(let i = 0; i<3; i++){
        // Uso un regex per il pattern che riconosce unicamente consonanti, precisamente la prima in ordine di apparizione
        const consonantsRegex = /[B-DF-HJ-NP-TV-Z]/
        // Regex per il pattern, riconosco la prima vocale che appare nella stringa
        const vowelsRegex = /[AEIOU]/
        let matchIndex;

        if(consonantsRegex.test(value)){
            // Salvo l'indice del primo carattere che appartiene al pattern di consonantsRegex
            matchIndex = value.search(consonantsRegex);
            // Aggiungo al risultato il carattere nella posizione dell'indice salvato prima
            result += value[matchIndex];
            // Cancello il carattere aggiunto al risultato dalla stringa iniziale
            value = value.replace(value[matchIndex], '');
        }else if(vowelsRegex.test(value)) {
            matchIndex = value.search(vowelsRegex);
            result += value[matchIndex];
            value = value.replace(value[matchIndex], '');
        }else{
            // Nel caso in cui non siano rimaste né vocali né consonanti allora aggiunge una X
            result += 'X'
        }
    }

    return result;
}

function dateManipulator(birthDate){
    let result = '';
    
    // Oggetto che mette in relazione il numero del mese alla relativa lettera
    const relativeAlphas = {
        "01": "A", 
        "02": "B", 
        "03": "C", 
        "04": "D", 
        "05": "E", 
        "06": "H", 
        "07": "L",
        "08": "M",
        "09": "P", 
        "10": "R",
        "11": "S",
        "12": "T"
    };

    // Aggiungo al risultato le ultime due cifre del primo elemento dell'array, ovvero l'anno
    result += birthDate[0].slice(2, 4);
    // Aggiungo al risultato il valore (lettera) relativo alla chiave (numero del mese) 
    result += relativeAlphas[birthDate[1]];
    // Aggiungo al risultato l'ultimo elemento dell'array ovvero il giorno
    result += birthDate[2]; 

    return result;
}

const user = new User()