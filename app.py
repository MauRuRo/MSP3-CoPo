import os
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)

app.config["MONGO_DBNAME"] = 'CoPoDB'
app.config["MONGO_URI"] = 'mongodb+srv://root:root@myfirstcluster-wegta.mongodb.net/task_manager?retryWrites=true&w=majority'

mongo = PyMongo(app)

# INSERT APP ROUTES HERE
@app.route('/')
def home(): 
    return render_template("index.html")
@app.route('/test')
def test():
    return render_template("test.html")
if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
#REMEMEBER TO SET DEBUG TO FALSE WHEN DONE WITH PROJECT!