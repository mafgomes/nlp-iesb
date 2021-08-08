$(function(){
    console.log('Carregou!!')
    $('#home').show()
    $('#stt').hide()
    $('#tts').hide()

    $('#nav_home').click(function(){
        console.log('Home')
        $('#home').show()
        $('#tts').hide()
        $('#stt').hide()

    })

    $('#nav_stt').click(function(){
        console.log('STT')
        $('#home').hide()
        $('#tts').hide()
        $('#stt').show()

    })

    $('#nav_tts').click(function(){
        console.log('TTS')
        $('#home').hide()
        $('#tts').show()
        $('#stt').hide()

    })

    $('#btnGravar').click(function(){
        if($(this).text()==='Gravar'){
        mediaRecorder.start()
        $(this).text('Finalizar')
        } else {
        mediaRecorder.stop()
        $(this).text('Gravar')
        }
    })

    $('#transcriptButton').click(function(){
        console.log("Transcrição")
        //let urlAPI = endpoint + "?key=" + apiKey + " &q=" + $( this ).text()
        // let urlAPI = 'http://127.0.0.1:5000/teste'
        // $.ajax({
        // 	method='GET',
        // 	url: urlAPI,
        // 	contentType: "application/json",
        // 	dataType: 'json',
        // 	success: function(result){
        // 		console.log(result);
        // 	}
        // })
    })

})