from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import json

def ttsWatson(texto):
    authenticator = IAMAuthenticator('dPV78Zceg1PKEcHR7nxgZZ5IQbCnuKrL3yLmZX8_XLOp')
    tts = TextToSpeechV1(
         authenticator=authenticator
        )

    with open('./flaskr/static/audio/audio.wav', 'wb') as audio_file:
        content = tts.synthesize(texto,
            voice='pt-BR_IsabelaVoice',
            accept='audio/wav'
        ).get_result().content
        print('gravar arquivo')
        print (type(content))
        audio = audio_file.write(content)
        print (type(audio))
        path = ('./static/audio/audio.wav')
    return path
