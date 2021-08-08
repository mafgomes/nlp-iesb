
import os
import json
from pathlib import Path
from flask import Flask, render_template
from flask import send_file
from flask_bootstrap import Bootstrap
from flask import jsonify, request
import flaskr.classes.sttwatson as stt
import flaskr.classes.ttswatson as tts

app = Flask(__name__)
app.config['TITLE']= "Papagaio"
Bootstrap(app)


@app.route("/")
def view_home():
    return render_template("index.html", nav_item="inicio")

@app.route('/convert-speech', methods=['POST'])
def translate_text():
    print('entrada')
    f = open('./file.wav', 'wb')
    f.write(request.data)
    f.close()
    path = ('./file.wav')
    response = stt.sttWatson(path)
    return jsonify(response)

@app.route("/convert-text", methods=['POST'])
def translate_audio():
    print('entrada')
    text = request.get_json(force=True)
    print (text)
    print (text.keys())
    print (text['data']['text'])
    path = tts.ttsWatson(text['data']['text'])
    return jsonify({"path": path})
#    return send_file(
#        path_to_file, 
#        mimetype="audio/wav", 
#        as_attachment=True, 
#        attachment_filename="audio.wav")