/**
 * @author mic4ael
 */

function createAssocLetters(arg){
    var obj = {};
    
    for(var i = 0; i < arg.length; ++i) {
        obj[arg[i]] = i;
    }
    
    return obj;
}

var tableGrid = document.getElementById("canv");
var toEncode = document.getElementById("tekst");
var key = document.getElementById("klucz");
var errors = document.getElementById("errors");
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var assocLetters = createAssocLetters(letters);
var alphSize = letters.length;
var cryptogram = document.getElementById("cryptogram");
var decodeOrEncode = true; // default behaviour: encode

function clearErrors() {
    $(errors).html("").hide();
}

function validate(arg) {
    var flag = true;
    var regex = /^[A-Za-z]+$/;
    var errorMsg = "Złe wartości wprowadzone dla pola: ";
    
    clearErrors();
    
    for(var i = 0; i < arg.length; ++i) {
        var controlFlag = true;
        
        if (arg[i].value == null || arg[i].value == "") {
            controlFlag = false;
            flag = false;
            $('#' + arg[i].id + 'Id').removeClass('has-success').addClass('has-errors');
            $(errors).append("Brak wartości dla pola: " + arg[i].id + '.</br>').show();
            continue;
        }
        
        if (!arg[i].value.match(regex)) {
            flag = false;
            controlFlag = false;
            $('#' + arg[i].id + 'Id').removeClass('has-success').addClass('has-errors');
            $(errors).append(errorMsg + arg[i].id + '.</br>').show();
        }
        
        if(controlFlag == true && $('#' + arg[i].id + 'Id').hasClass('has-errors')) {
            $('#' + arg[i].id + 'Id').removeClass('has-errors').addClass('has-success');
        }
    }
    
    return flag;
}

function checkPrerequisities() {
    return validate([key, toEncode]);
}

function drawGrid() {
    var tHead = tableGrid.createTHead();
    var headRow = tHead.insertRow(0);
    
    for(var i = 0; i < alphSize; ++i) {
        var hCol = headRow.insertCell(i);
        hCol.innerHTML = letters[i];
        hCol.id = letters[i];
    }
    
    for(var i = 0; i < alphSize; ++i){
        var row = tableGrid.insertRow(i+1);
        row.id = 'row' + letters[i];
        row.height = '38px';
        
        var innerIter = 0;
        
        for(var j = i; j < alphSize + i; ++j) {
            var cell = row.insertCell(innerIter);
            cell.id = 'col' + letters[innerIter % alphSize] + row.id.toString().slice(3) ;
            cell.innerHTML = letters[j % alphSize];
            innerIter++;
        }
    }
}

window.onload = function() {
    drawGrid();
};

function compareTables(arg1, arg2) {
    var ret = arg1.slice(0);
    
    for(var i = 0; i < arg2.length; ++i){
        var index = ret.indexOf(arg2[i]);
        
        if ( index != -1) {
            ret.splice(index,1);
        }
    }
    
    return ret;
}

$(key).keyup(function() {
    var keyValues = $(key).val().toUpperCase().split('');
    var valuesToExclude = compareTables(letters, keyValues);
 
    if(!validate([key]) || keyValues.length == 0) {
        keyValues = letters.slice(0);
        valuesToExclude = [];
    }
    
    for(var i = 0; i < keyValues.length; ++i) {
        $('#row' + keyValues[i]).show(1000).css({
            'height' : '38px'
        });
    }
    
    for(var i = 0; i < valuesToExclude.length; ++i) {
        $('#row' + valuesToExclude[i]).hide(1000);
    }  
});

function createFinalKey() {
    var msgLength = toEncode.value.length;
    var keyLength = key.value.length;
    var result = "";
    
    if(keyLength > msgLength)
        return key.value; 
    
    for(var i = 0; i < msgLength; ++i) {
        result += key.value.charAt(i % keyLength);
    }
    
    return result;
}

function clearGrid() {
    $('[id*="row"], [id*="col"]').removeClass('result');
}

function encrypt() {
    var keyToCode = createFinalKey();
    var loop = toEncode.value.length;
    
    for(var i = 0; i < loop; ++i) {
        var msgLetter = assocLetters[toEncode.value[i].toUpperCase()];
        var keyLetter = assocLetters[keyToCode.charAt(i).toUpperCase()];
        
        func = function(iter, ch1, ch2) {
            clearGrid();
            $('#row' + keyToCode.charAt(iter).toUpperCase()).addClass('result');
            
            if (decodeOrEncode) {
                cryptogram.value += letters[(ch1 + ch2) % letters.length];
                $('[id*="' + 'col' + toEncode.value[iter].toUpperCase() + '"]').addClass('result');
            } else {
                var tmp = (ch1 - ch2) < 0 ? letters.length + ch1 - ch2 : ch1 - ch2;
                cryptogram.value += letters[tmp % letters.length];    
                $('[id*="' + 'col' + letters[tmp].toUpperCase() + '"]').addClass('result');
                $('td[id=' + letters[tmp] + ']').css({
                    'background' : 'yellow'
                });
                setTimeout(function() {
                    $('td[id=' + letters[tmp] + ']').css({
                        'background' : ''
                    });
                }, 2000);
            }
        };
        
        setTimeout(func, i * 2000, i, msgLetter, keyLetter);
    }
}

function run() {
    if (checkPrerequisities()) {
        cryptogram.value = '';
        $('#canv').removeClass('table-striped');
        encrypt();
    } else {
        alert('Wszystko nie gra!');
    }
}

function setActive(el) {
    $('li').removeClass('active');
    $(el.parentNode).addClass('active');
}

function encode() {
    decodeOrEncode = true;
    $('label[for="tekst"]').innerHTML = 'Tekst do zaszyfrowania';
    $('#action').html('Szyfruj');
    cryptogram.value = 'Zaszyfrowany tekst';
}

function decode() {
    decodeOrEncode = false;
    $('label[for="tekst"]').html('Tekst do odszyfrowania');
    $('#action').html('Deszyfruj');
    cryptogram.value = 'Odszyfrowany tekst';
}


