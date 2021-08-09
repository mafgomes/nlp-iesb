from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import json
import os


def ttsWatson(texto):
    dirname = './static/audio/'

    authenticator = IAMAuthenticator('dPV78Zceg1PKEcHR7nxgZZ5IQbCnuKrL3yLmZX8_XLOp')
    tts = TextToSpeechV1(
         authenticator=authenticator
        )

    # Aqui, idealmente, a gente teria que apagar os arquivos
    # de áudio oriundos de conversões anteriores...
    # como, por ora, estamos com espaço em disco sobrando,
    # não vamos esquentar a cabeça com isso agora.

    #with os.scandir(dirname) as it:
    #  for entry in it:
    #    if entry.name.startswith('audio') and entry.name.endswith('.wav') and entry.is_file():
    #        #print(entry.name)
    #        os.remove(entry.name)

    name = dirname + 'audio' + str(os.getpid()) + '.wav'

    with open(name, 'wb') as audio_file:
        content = tts.synthesize(texto,
            voice='pt-BR_IsabelaVoice',
            accept='audio/wav'
        ).get_result().content
        #print('gravar arquivo')
        #print (type(content))
        audio = audio_file.write(content)
        #print (type(audio))
        path = (name)
    return path
