import os
from flask import Flask, render_template, redirect, request, url_for, json
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import datetime

app = Flask(__name__)
app.jinja_env.add_extension('jinja2.ext.do') # found here: https://stackoverflow.com/questions/17925674/jinja2-local-global-variable/17926422
# This extension is necessary to be able to use 'global' variables in for loops in the jinja html on the creations pages.
app.secret_key = os.getenv("SECRET_KEY")
app.config["MONGO_DBNAME"] = os.getenv("MONGO_DBNAME")
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# APP ROUTES

#homepage
@app.route('/')
def home(): 
    return redirect(url_for('creations'))

#homepage; the authoruser variable is set to None; this will result in the condition for the searchFuncAuthor not being satisfied; thus not performing a author search on page load complete.
@app.route('/creations')
def creations(): 
    return render_template("creations.html", copo_themes = mongo.db.copo_themes.find().sort("theme", 1), copo_authors = mongo.db.copo_creations.find().sort("Author", 1), copo_titles = mongo.db.copo_creations.find().sort("title", 1), authoruser = None)

#homepage/authorsearch; from the poem page the user can navigate to a search of an author by clicking on their name which has an href. It puts the author name in to a hidden div; from their jquery pulls the author name to perform an Ajax action with it on page load complete.
@app.route('/creations_author/<authoruser>')
def creations_author(authoruser): 
    return render_template("creations.html", copo_themes = mongo.db.copo_themes.find().sort("theme", 1), copo_authors = mongo.db.copo_creations.find().sort("Author", 1), copo_titles = mongo.db.copo_creations.find().sort("title", 1), authoruser = authoruser)

#homepage/theme selection: performs a query on the database and returns all titles with selected theme, sorted.
@app.route('/creations-theme-select', methods=['POST'])
def creationsThemeSelect(): 
    info = request.form["Theme"]
    themeselect = {"Theme":info}
    copo_titles = mongo.db.copo_creations.find(themeselect).sort("title", 1)
    ctitle = list(copo_titles)
    poemlist = {}
    i = 0
    for poem in ctitle:
        poemlist[i] = {"_id": str(poem.get("_id")), "title": poem.get("title")}
        i+=1
    return json.dumps(poemlist)

#homepage/author selection: performs a query on the database and returns all titles with selected author, sorted.
@app.route('/creations-author-select', methods=['POST'])
def creationsAuthorSelect(): 
    info = request.form["Author"]
    userselect = {"Author":info}
    copo_titles = mongo.db.copo_creations.find(userselect).sort("title", 1)
    ctitle = list(copo_titles)
    poemlist = {}
    i = 0
    for poem in ctitle:
        poemlist[i] = {"_id": str(poem.get("_id")), "title": poem.get("title")}
        i+=1
    return json.dumps(poemlist)

#search titles: performs a query to the database for a partial match with titles of the input in the searchbar.
@app.route('/searchpoems', methods=["POST"])
def searchpoems():
    info = request.form["title"]
    titleselect = {"title" : { "$regex": info, "$options":"i"}}
    copo_titles = mongo.db.copo_creations.find(titleselect).sort("title", 1) 
    ctitle = list(copo_titles)
    poemlist = {}
    i = 0
    for poem in ctitle:
        poemlist[i] = {"_id": str(poem.get("_id")), "title": poem.get("title")}
        i+=1
    return json.dumps(poemlist)

#Create: renders the 'create' page when create button is clicked: the themes have to be pulled from the database as these may vary over time.
@app.route('/create')
def create():
    return render_template("create.html", copo_themes = mongo.db.copo_themes.find().sort("theme",1))

#Collaborate: renders the collaborate page with all the info of the selected poem pulled from the database and pre-inputted in to the form.
@app.route('/collaborate/<poemId>')
def collaborate(poemId):
    return render_template("collaborate.html", poeminfo = mongo.db.copo_creations.find_one({"_id": ObjectId(poemId)}))

#Update: uploads the adjusted poem on submission of the collaboration form and also updates the version history information.
@app.route('/update_poem/<poemId>',methods=["POST"])
def update_poem(poemId):
    poems = mongo.db.copo_creations
    users = mongo.db.copo_users
    collaborator_prev = list(poems.find({"_id": ObjectId(poemId)}))
    collaborator_new = collaborator_prev[0].get("Collaborators")
    version_his = list(poems.find({"_id": ObjectId(poemId)}))[0].get("Version")
    for i in version_his:
        if i[3] == True:
            version = i[0]
    print(version)
    print(version_his)
    for i in version_his:
        i[3] = False
    collaborator_new.append({"authorname":request.form.get('Collaborator'), "colusername": request.form.get('username')})
    print(collaborator_new)
    version_his.append([int(version) + 1,  {"Poem" : request.form.get('Poem')}, {"Collaborators":collaborator_new} , True])
    print(version_his)
    poems.update_one( {'_id': ObjectId(poemId)},
    {
        '$set': {
            'Version' : version_his,
            'Poem' : request.form.get('Poem'),
            'Collaborators' : collaborator_new,
                }       
    })
    user = {
        "username" : request.form.get("username"),
        "password" : request.form.get("password"),
        "author_name" : request.form.get("Collaborator")
    }   
    if request.form.get("new_user") == "2":
        users.insert_one(user)
    return redirect(url_for('read', poem_id=poemId))

# Poem: renders the poem page to read the selected poem with href.
@app.route('/read/<poem_id>')
def read(poem_id):
    the_poem = mongo.db.copo_creations.find_one({"_id": ObjectId(poem_id)})
    return render_template("poems.html", poem=the_poem)   

# Upload Poem: uploads new poem to the database and (if applicable) uploads new user to the database after submission of create form.
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
        "Collaborators":[],
        "edit_YN": creation.get("allow_collab_text"),
        "Version" : [[1, {"Poem" : creation.get("Poem")}, {"Collaborators":[]} , True]],
        "Date" : date
    }

    user = {
        "username" : creation.get("username"),
        "password" : creation.get("password"),
        "author_name" : creation.get("Author")
    }
    poem_id = poems.insert_one(poem)

    if creation.get("new_user") == "2":
        users.insert_one(user)
    return redirect(url_for('read', poem_id=poem_id.inserted_id))

# Checks if user account already exists or not when filling in the user info fields on the forms.
@app.route('/checkUser', methods=['POST'])
def checkUser():
    user = request.form['username']
    users = mongo.db.copo_users
    exists = users.find_one({"username" : user })
    if exists is None:
        return json.dumps({'user':exists})
    else:
        return json.dumps({'user':exists.get("username"),'author': exists.get("author_name"),'password':exists.get("password")})

# Delete; deletes poem from database.
@app.route('/delete', methods=['POST'])
def delete():
    poemid = request.form['_id']
    mongo.db.copo_creations.delete_one({"_id": ObjectId(poemid)})
    return json.dumps({"check":"check"})

# Function to handle the 404 page
#found here: https://github.com/EliasOPrado/data-centric-backend-project
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Gets IP and PORT info from Mongo.
if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=False)
