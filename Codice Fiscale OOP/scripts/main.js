// Constructor che crea un oggetto User personalizzato
class User {
    // Proprietà dell'oggetto:
    constructor(nameElement, surnameElement, birthDateElement, genderElement, birthPlaceElement) {
        this.name = {
            firstName: this.#namesValidator(nameElement),
            consonants: () => { 
                const consonantsArray = this.name.firstName.match(/[B-DF-HJ-NP-TV-Z]/g); 
                return consonantsArray.length;
            }
        };
        this.surname = this.#namesValidator(surnameElement);
        this.gender = this.#genderValidator(genderElement);
        this.birthDate = this.#dateValidator(birthDateElement);
        this.birthPlace = this.#placeValidator(birthPlaceElement);
    }

    generatePersonalCode = () => {
        let finalResult = '';
        finalResult += this.#namesManipulator(this.surname, false);
        finalResult += this.#namesManipulator(this.name, true);
        finalResult += this.#dateManipulator(this.birthDate, this.gender);
        finalResult += this.#placeManipulator(this.birthPlace);
        finalResult += this.#checkDigit(finalResult);
        return finalResult;
    }

    // # prefisso che indica il metodo come privato e quindi non chiamabile dall'esterno
    #namesValidator(input){
        // Uso regex per ricercare un pattern specifico nella stringa di input
        // Regex: [A-Za-z] (tutte le lettere maiuscole e minuscole), \s? (spazio opzionale)
        const checkRegex = /[A-Za-z]+\s?/g
        // Uso test() per cercare il pattern nella stringa
        if(checkRegex.test(input.value)){
            // Se pattern ritrovato nella stringa allora viene ritornato il valore e poi assegnato a this.name
            return input.value.toUpperCase();
        }else{
            // Se non è ritrovato il pattern allora il bordo del campo input diventa rosso
            input.style.borderColor = 'red';
            alert('Inserire un testo valido.\nSono ammesse unicamente lettere e spazi.');
            input.value = '';
        } 
    }

    #dateValidator(input) {
        // Creo un'istanza dell'oggetto Date
        let todayDate = new Date();
        // Creo un array che contiene l'anno, il mese e il giorno selezionati dall'utente
        const birth = input.value.split('-');
        // Creo una nuova istanza di Date con i parametri anno, mese e giorno
        const birthObj = new Date(parseInt(birth[0]), parseInt(birth[1])-1, parseInt(birth[2]));
        
        // Effettuo la comparazione tra la data inserita e la data di oggi, se l'input riferisce una data futura ritorna un errore
        if (birthObj > todayDate) {
            input.style.borderColor = 'red';
            alert('Inserire una data passata');
            input.value = '';
            return;
        }

        // Ritorno l'array della data scelta dall'utente
        return birth;
    }

    #genderValidator(input) {
        // Se viene selezionata l'opzione nulla da' errore
        if(input.value === 'none'){
            input.style.borderColor = 'red';
            alert('Inserire un valore valido nel campo "Sesso".');
            input.value = '';
        }else{
            return input.value;
        }
    }

    #placeValidator(input){
        input.value = input.value.toUpperCase();
        let result = false;
        let code;

        valuesJSON.forEach(value => {
            if(value.name === input.value){
                result = true;
            }
        });

        if(result){
            return input.value;
        }else{
            input.style.borderColor = 'red';
            alert('Comune inserito non trovato.')
            input.value = '';
        }

    }

    #namesManipulator(value, isName) {
        // Numero di iterazioni standard
        let sectionLength = 3;
        let result = '';

        // Se sta venendo trattato il nome si controllano il numero di consonanti e se superano 4 si aumenta di uno il ciclo for seguente
        if(isName){
            sectionLength = value.consonants() >= 4 ? 4 : 3;
            // value diventa la sottoproprietà di name perché questa contiene effettivamente il nome utente
            value = value.firstName; 
        }

        for(let i = 0; i<sectionLength; i++){
            // Uso un regex per il pattern che riconosce unicamente consonanti, precisamente la prima in ordine di apparizione
            const consonantsRegex = /[B-DF-HJ-NP-TV-Z]/
            // Regex per il pattern, riconosco la prima vocale che appare nella stringa
            const vowelsRegex = /[AEIOU]/
            let matchIndex;

            if(consonantsRegex.test(value)){
                // Se il numero di iterazioni è 4 ed è la seconda iterazione salta solo quest'ultima
                if(i === 1 && sectionLength === 4){
                    continue;
                }
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
            result += 'X';
            }
        }

        console.log(result)
        return result;
        
    }

    #dateManipulator(birthDate, gender){
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
        // Aggiungo al risultato l'ultimo elemento dell'array ovvero il giorno, se femmina sommo alla data 40
        result += (gender === 'FEMALE') ? parseInt(birthDate[2])+40 : birthDate[2];

        return result;
    }

    #placeManipulator(birthPlace){
        let code = "";
        // Per ogni elemento nel file JSON
        valuesJSON.forEach(value => {
            // Se il value della key name equivale a birthPlace allora assegna il value di code alla var
            if(value.name === birthPlace){
                code = value.code;                                
            }
        })

        // Ritorna il codice catastale
        return code;
    }

    #checkDigit(code) {
        const alphabet  = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z'
        ];

        let sum = 0;

        for(let i = 0; i<code.length; i++){
            if(i%2 === 0){
                sum += this.#oddConversion(code[i]);
            }else{
                if(isNaN(parseInt(code[i]))){
                    sum += alphabet.indexOf(code[i]);
                }else{
                    sum += parseInt(code[i]);
                }
            }
        }

        return alphabet[sum%26];
    }

    #oddConversion (value) {
        const oddAlpha = {
            '0': 1,
            '1': 0,
            '2': 5,
            '3': 7,
            '4': 9,
            '5': 13,
            '6': 15,
            '7': 17,
            '8': 19,
            '9': 21,
            'A': 1, 
            'B': 0,  
            'C': 5,  
            'D': 7,  
            'E': 9, 
            'F': 13,  
            'G': 15,  
            'H': 17,  
            'I': 19, 
            'J': 21,  
            'K': 2, 
            'L': 4, 
            'M': 18, 
            'N': 20, 
            'O': 11, 
            'P': 3, 
            'Q': 6, 
            'R': 8, 
            'S': 12, 
            'T': 14, 
            'U': 16, 
            'V': 10, 
            'W': 22, 
            'X': 25, 
            'Y': 24, 
            'Z': 23
        };

        return oddAlpha[value];
    }
}


let valuesJSON
document.addEventListener('DOMContentLoaded', async () => {
    valuesJSON = await fetchJSON();
})

// La keyword async indica che la funzione agisce in maniera asincrona al normale procedimento del programma
async function fetchJSON() {
    let jsonValues;

    // Aspetto che venga preso il file JSON e convertito prima di continuare con il resto del programma
    await fetch('../JSON/dati.json')
        .then(response => jsonValues = response.json())

    // Ritorno il file JSON
    return jsonValues;
}


function sendForm(event){
    // Prevengo il ricaricamento della pagina all'invio del form
    event.preventDefault();
    console.log('sent')
    const user = new User(
        document.getElementById('name'), 
        document.getElementById('surname'), 
        document.getElementById('birthDate'), 
        document.getElementById('gender'),
        document.getElementById('birthPlace')
    );

    document.getElementById('form-inputs-container').style.display = 'none';
    document.getElementById('resultDiv').style.display = 'flex';
    document.getElementById('resultTag').innerHTML = user.generatePersonalCode();  
}

function reset(){
    window.location.reload();
}
