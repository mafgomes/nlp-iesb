from ibm_watson import SpeechToTextV1
from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import json

class sttwatson:
    def get_translation(self, request):
        authenticator = IAMAuthenticator('P3_Qv43uneTlHj47J-9YhThh0JfAzPF0EN7eooqDvrm8')
        speech_to_text = SpeechToTextV1(
            authenticator=authenticator
        )

        with open('teste1.wav','rb') as audio_file:
            print('testes')
            speech_recognition_results = speech_to_text.recognize(
                audio=audio_file,
                content_type='audio/wav',  
                model='pt-BR_BroadbandModel'     
            ).get_result()
        return(json.dumps(speech_recognition_results, indent=2))

