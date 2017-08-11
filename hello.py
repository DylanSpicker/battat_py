from flask import Flask, render_template, request, jsonify
import atexit
import cf_deployment_tracker
import os
import json
import twitter
from watson_developer_cloud import PersonalityInsightsV3

# Emit Bluemix deployment event
cf_deployment_tracker.track()

app = Flask(__name__)

# On Bluemix, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8080
port = int(os.getenv('PORT', 8080))

@app.route('/detailed')
def detailed():
    return render_template('detailed.html')

@app.route('/')
def summary():
    return render_template('index.html')

@app.route('/return_top_results', methods=['POST', 'GET'])
def results():
    return_text = ""
    return_object_concept = {}
    return_object_keyword = {}
    return_object_entity = {}
    return_object = {'concepts': [], 'keywords': [], 'entities': []}

    file_name = request.form['request_input']
    limit = int(request.form['limit'])
    sentiment = request.form['sentiment']

    if file_name is None:
        file_name = 'all'

    if sentiment is None:
        sentiment = 'any'

    if limit is None:
        limit = 20

    with open("json_output/"+file_name+".json") as json_f:
        return_text = json.loads(json_f.read())

    if type(return_text) is list:
        for rt in return_text:
            if sentiment != 'any' and rt['response_object']['sentiment']['document']['label'] != sentiment: 
                continue

            for keyword in rt["response_object"]["keywords"]:
                if keyword['text'] not in return_object_keyword.keys():
                    return_object_keyword[keyword['text']] = 0
                return_object_keyword[keyword['text']] += keyword['relevance']

            for entity in rt["response_object"]["entities"]:
                if entity['text'] not in return_object_entity.keys():
                    return_object_entity[entity['text']] = 0
                return_object_entity[entity['text']] += entity['relevance']


            for concept in rt["response_object"]["concepts"]:
                if concept['text'] not in return_object_concept.keys():
                    return_object_concept[concept['text']] = 0
                return_object_concept[concept['text']] += concept['relevance']

        if "response_object" in return_text[0].keys():
            return_text[0]["response_object"]["concepts"]

    if return_object_concept is not None and len(return_object_concept) > 0: 
        return_object['concepts'] = sorted(return_object_concept.items(), key=lambda x: x[1], reverse=True)[0:limit]
    if return_object_keyword is not None and len(return_object_keyword) > 0: 
        return_object['keywords'] = sorted(return_object_keyword.items(), key=lambda x: x[1], reverse=True)[0:limit]
    if return_object_entity is not None and len(return_object_entity) > 0: 
        return_object['entities'] = sorted(return_object_entity.items(), key=lambda x: x[1], reverse=True)[0:limit]

    return jsonify(return_object)

@app.route('/json_output/<hash>', methods=['POST', 'GET'])
def renderJsonView(hash):
    return_text = ""
    with open('json_output/'+hash+'.json') as json_f:
        return_text = json_f.read()
    
    return jsonify(return_text)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
