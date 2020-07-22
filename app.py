import os
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import datetime

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
    return render_template("create.html", copo_themes = mongo.db.copo_themes.find().sort("theme",1))

@app.route('/read/<poem_id>')
def read(poem_id):
    the_poem = mongo.db.copo_creations.find_one({"_id": ObjectId(poem_id)})
    return render_template("poems.html", poem=the_poem)   

@app.route('/poems')
def poems():
    return render_template("poems.html, <poem>")

@app.route('/insert_poem', methods=["POST"])
def insert_poem():
    poems = mongo.db.copo_creations
    users = mongo.db.copo_users
    creation = request.form.to_dict()
    date = datetime.datetime.now()
    if creation.get("Theme") == "Other":
        theme = creation.get("new_theme")
        themedict = {
            "theme" : theme
        }
        mongo.db.copo_themes.insert_one(themedict)
    else:
        theme = creation.get("Theme")
        

    poem = {
        "title" : creation.get("title"),
        "Poem" : creation.get("Poem"),
        "Theme" : theme,
        "Author" : creation.get("Author"),
        "username" : creation.get("username"),
        "Version" : 1,
        "Date" : date
    }

    user = {
        "username" : creation.get("username"),
        "password" : creation.get("password"),
        "author_name" : creation.get("Author")
    }
    poems.insert_one(poem)
    if creation.get("new_user") == 2:
        users.insert_one(user)
    return redirect(url_for('creations'))

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
#REMEMEBER TO SET DEBUG TO FALSE WHEN DONE WITH PROJECT!