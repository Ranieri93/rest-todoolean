$(document).ready(function() {
    // mi preparo subito le variabili per handlebars:

    var source  = $("#toDo-Template").html();
    var template = Handlebars.compile(source);

    // creo una variabile per l'url delle chiamate ajax:

    var urlBasic = 'http://157.230.17.132:3010/todos/';

    // chiamo la mia funzione a prescindere:
    toDoGET()

    // intercetto l'evento sul button:

    $('#buttonTrigger').click(function() {
        // mi recupero il testo inserito dall'utente:
        // pongo le condizioni di trim e di lunghezza del contenuto di modo da evitare possibili quickshort da parte dell'utente:
        var textInput = $('#inputTrigger').val().trim();
        console.log(textInput);

        // resetto l'input
        $('#inputTrigger').val('');
        // richiamo la funzione con il valore dell'input:
        toDoPost(textInput);

    });

    $('#inputTrigger').keypress(function(event) {
        if(event.which == 13) {
            var textInput = $('#inputTrigger').val().trim();
            console.log(textInput);
            $('#inputTrigger').val('');
            toDoPost(textInput);
        }
    });

    // intercetto il click sull'icona per gestire la delete:

    $('#todo-list').on('click', '.deleteTodo',function(){

        // mi recuper l'id di ogni li:
        var idLi = $(this).parent().attr('data-id');
        console.log(idLi);
        // richiamo la funzione con il delete e l'id matchato dell'li giusto
        toDoDelete(idLi)
    })

    // intercetto il click sull'icona della matita:

    $('#todo-list').on('click', '.editTodo',function(){
        // sono andato a fare il controllo sulla singola apertura dell'input:
        $('.editTodo').removeClass('d-none');
        $('.textTodo').removeClass('d-none');
        $('.editInput').removeClass('d-inline-block');


        var editLi = $(this).parent()
        // vado a nascondere il testo e l'icona della matita per mostrare solo l'input:
        editLi.find('.editTodo').addClass('d-none');
        editLi.find('.textTodo').addClass('d-none');
        editLi.find('.editInput').addClass('d-inline-block')
    });

    //mi intercetto l'evento sul keypress dell'input :

    $('#todo-list').on('keypress', '.editInput',function(){
        if(event.which == 13) {
            //recuper l'input
            var inputText = $(this).val();

            // recupero l'id del li:
            var idList = $(this).parent().attr('data-id');

            toDoPut(inputText,idList)

        }
    });

    function toDoGET () {
        // preparo la prima chiamata ajax:
        $.ajax({
            'url': urlBasic,
            'method':'GET',
            'success':function(data) {

                $('#todo-list').empty();

                // mi recupero i testi da scrivere in pagina tramite la dot notation:
                for (var i = 0; i < data.length; i++) {
                    var currentdata = data[i];
                    var currentText = currentdata.text;
                    var currentId = currentdata.id;
                    // variabili handlebars
                    var templateVariables = {
                        toDoLi: currentText,
                        toDoId: currentId
                    };
                    var htmlToDo = template(templateVariables);
                    $('#todo-list').append(htmlToDo)
                }
            },
            'error': function() {
                alert('error')
            }
        })
    }

    function toDoPost (userInput) {

        // adesso dovrò andare a fare un'altra chiamata ajax, con method POST di modo da aggiungere il valore alla lista:
        $.ajax({
            'url': urlBasic,
            'method':'POST',
            // qui inserisco come data il valore del mio input:
            'data': {
                'text': userInput,
            },
            'success': function(data) {

                toDoGET()
            },
            'error': function() {
                alert('error')
            }
        });
    }

    function toDoDelete (id) {

        $.ajax({
            'url': urlBasic + id,
            'method':'DELETE',
            // qui inserisco come data il valore del mio input:
            'success': function(data) {
                toDoGET()
            },
            'error': function() {
                alert('error')
            }
        });
    }

    function toDoPut (input, id) {
        // qui avrò due variabili per la mia funzione, che saranno l'input dell'utente e l'id del li, perchè io necessito di agganciarmi a qualcosa.
        $.ajax({
            'url': urlBasic + id,
            'method':'PUT',
            'data': {
                'text': input,
            },
            'success': function(data) {

                toDoGET()
            },
            'error': function() {
                alert('error')
            }
        });
    }
})
