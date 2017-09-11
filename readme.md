# Battat Toys - Analysis Dashboard

![alt text](https://github.com/DylanSpicker/battat_py/raw/master/readme_img/battat.gif)

## Description
This demo application showcases Watson's NLP abilities by showcasing the static data that can be derived with the Natural Language Understanding service. Specifically, Amazon Reviews relating to toys produced by Battat were scraped, and then fed into Watson's NLU service. The service gave rise to a tremendous amount of annotated data, which was then aggregated by product, concept, or keyword. To push this application further, better aggregation techniques, data visualization, and search functionality would all be great add-ons.

View the application: [https://battat.mybluemix.net/](https://battat.mybluemix.net/)

## Getting Started
This particular application does not use any Watson calls in it - instead, the results of calls to Watson's [Natural Language Understanding](https://www.ibm.com/watson/services/natural-language-understanding/) service are stored in the ```json_output/``` folder. The data in here can be switched out as necessary, and then only the list of products or concepts would need to change correspondingly. 

Thus, to get started simply:

1. Clone the GitHub Repository.
2. Run `pip install -m requirements.txt` to install the requirements.
3. Run `python hello.py` to start the server.
4. Visit `localhost:5000` in a web browser to view the application.