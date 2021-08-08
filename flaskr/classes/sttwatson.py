import os
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import json

def sttWatson(audio_input):
    authenticator = IAMAuthenticator('P3_Qv43uneTlHj47J-9YhThh0JfAzPF0EN7eooqDvrm8')
    speech_to_text = SpeechToTextV1(
        authenticator=authenticator
    )

    print ('iniciar conversao')
    with open(audio_input,'rb') as audio_file:
        print('testes')
        speech_recognition_results = speech_to_text.recognize(
            audio=audio_file,
            content_type='audio/wav',  
            model='pt-BR_BroadbandModel'     
        ).get_result()
        print(speech_recognition_results)
#    return(speech_recognition_results['results'])
    return(speech_recognition_results)
