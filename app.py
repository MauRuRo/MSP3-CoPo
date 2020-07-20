import os
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)

app.config["MONGO_DBNAME"] = 'CoPoDB'
app.config["MONGO_URI"] = "mongodb+srv://root:root@myfirstcluster-wegta.mongodb.net/CoPoDB?retryWrites=true&w=majority"
# DON'T FORGET TO HIDE PASSWORD IN URI BEFORE LAUNCH
mongo = PyMongo(app)

# INSERT APP ROUTES HERE
@app.route('/')
def home(): 
    return render_template("index.html")

@app.route('/creations')
def creations(): 
    return render_template("creations.html", copo_themes = mongo.db.copo_themes.find().sort("theme", 1), copo_authors = mongo.db.copo_users.find().sort("author_name", 1), copo_titles = mongo.db.copo_creations.find().sort("title", 1))

@app.route('/create')
def create():
    return render_template("create.html", copo_themes = mongo.db.copo_themes.find())

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
#REMEMEBER TO SET DEBUG TO FALSE WHEN DONE WITH PROJECT!