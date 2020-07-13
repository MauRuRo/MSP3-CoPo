import os
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import flask_pymongo
from bson.objectid import ObjectId

app = Flask(__name__)

app.config["MONGO_DBNAME"] = ''
app.config["MONGO_URI"] = ''

mongo = PyMongo(app)

# INSERT APP ROUTES HERE

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
#REMEMEBER TO SET DEBUG TO FALSE WHEN DONE WITH PROJECT!