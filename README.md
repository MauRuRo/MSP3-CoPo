![CoPo Logo](/static/images/copologo1.png)
# CoPo: it's about the words.    

This web application is designed to bring people who are or want to be creative with words together to produce collaborative writing projects (poems). Secondary goals are to for users to make individual poetry or to be inspired by other user's work or to be inspired by published works uploaded by other users or to inspire other with published works.

The website was deployed using Heroku and can be viewed here: http://msp3-copo.herokuapp.com/

## UX ##

The following user stories apply:
* As a user, I want to create a poem and share it online.
* As a user, I want to collaborate on a poem.
* As a user, I want to read poems that others have published in the app.
* As a user, I want to delete poems that I have published.
* As a user, I want to see the version history of a poem.

### Design ###

![CoPo Logo](/static/images/homemockup.png)


For this project I've chosen a more or less minimalist design approach, but not strictly minimalist. Due to the little amount of content on the page it was tricky to design something that would come across normally on especially larger devices/laptops/4k screens. 

The design is centred around mobile device use, where the content fills the screen. However, on larger devices there is lots of empty space to the sides of the centred content. Because I did not want to complicate the web application by creating more content, I chose for a design solution. 

The ink blot pattern on the background in black and white has an abstract feel to it and is relatable to the writing theme (because of the ink) and the creativity theme (because of the messy blots) and therefor matches well with the page content. The centre of the screen is mostly free of blots in order for it not to interfere with the viewing of the page content. I considered a slow animation of the background, slowly become larger/smaller, but decided against it when I discovered it made me nauseous. 

![CoPo Logo](/static/images/feathercross2.png)

The black/white theme is contrasted subtly by the logo -two crossed writing feathers (stands for two writers collaborating)- which is very colourful with beautiful complimentary colours. The colourful logo is partly repeated in the 'Create' (single feather) and 'Collaborate' (crossed feathers) button. 

I considered leaving it at that, but the design was still too minimalist for my taste, which I why I implemented a very subtle linear gradient colour on the buttons on the main page. The colours of the linear gradient are sampled from the logo, thus remaining within the colour scheme of the page. 

![CoPo Logo](/static/images/poemmockup.png)

For most text areas on the page I've implemented a very subtle highly transparent white background linear gradient, in order for the background image not to interfere with the viewing of the content.

The main font I've chosen is "Gloria Hallelujah", which has a 'handwritten' quality to it which matches nice with the writing theme of the app. Though it's not overlerly curly or italic as to become illegible or out of style with general web experience. For the paragraph font I selected the Open Sans font, as suggested by google fonts.

You can view the original basic wireframe for smartphone that was used as the base of the design using this link: https://github.com/MauRuRo/MSP3-CoPo/blob/master/static/images/CoPo%20wireframe%20base.pdf

## Database Structure ##

For the database this project makes use of MongoDB. The app makes use of three database collections. Below are examples of single documents from each collection.

1. copo_creations

    {

        _id:"automaticcaly generated ID"

        title:"poem title"

        Poem:"poem text"

        Theme:"poem theme"

        Author:"poem Author"

        username:"usernam"

        Collaborators: [
            {
                authorname:"author name", 
                colusername:"username of collaborator"
            },
            {},{}...]

        Version: [
            [
                "version number", 
                Poem: "version poem text, 
                {Collaborators: [
                                    {
                                        authorname:"author name",
                                        colusername:"username of collaborator"
                                    },{},{},...
                ]}, 
                "Boolean Value"
            ],
            [],[],....
        ]

        Date: "date value of the moment that poem was uploaded"

        edit_YN: "Y or N"

    }
    
2. copo_themes

    {

        _id:"automaticcaly generated ID"

        theme:"theme"

    }
3. copo_users

    {

        _id:"automaticcaly generated ID"

        username:"username"

        authorname:"author name"

        password:"user password"

    }

*copo_creations* is the collection used to store poems. This is the main collection of the app and is used the most. It also has some complex nested arrays for Collaborators and Version history functionality.

*copo_themes* is a small collection that maintains a database of the available themes a user can choose from when uploading their poem. It's updated if a user chooses to create a new theme.

*copo_users* manages the user accounts and is used for validating accounts for uploading as existing/non-existing user or deleting poems.

## Features ##

### Existing Features ###

* Search bar to search by title. The user's input is compared to the titles in the database and titles with partial matches are returned.
* Search by options: Search by Theme, Search by Author, Search by Title.
* Create form: the user can use this form to upload a new poem, either with an existing user account or by creating a new one. Depending on existing/new user the username and password fields are validated differently.
* Collaborate form: the user can use this form to collaborate on a poem and update it on the database, either as an existing or as a new user.
* Users can/must assign a theme to their poem. If theme of choice is not listed, they can add a new theme to the database.
* Users can create/collaborate on poems with one user account, but can change the Author name for each poem individually; that way a user can upload for example a published poem by a famous poet without having to create a new account. The author name used on the first upload is stored in the database and will always be returned to the forms when filling out the username and password.
* Delete form: the user can use this form to delete a poem, but only if they are the original author; it is password protected.
* Version history navigation: a log is kept of all the changes made to the poem and by which author. The user can view the version history of a poem. (Navigation also possible by using arrow keys.)

### Features Left to Implement ###

* A rating system that would the user could also sort by.
* A comment section on each poem. 
* An email service that sends notifications to users if their poem has been collaborated on (or commented on).

## Technologies Used ##
* HTML5
  * To give the website content and structure.
* CSS3
  * To design the look and layout of the website.
* JavaScript
  * To enable user interaction with the website.
* jQuery
  * To simplify DOM manipulation.
* Materialize
  * To layout the pages using the Grid system and the use of its Form elements.
* GoogleFonts
  * To set the main fonts for the website.
* Python
    * Used in Jinja on html pages and in app.py for Flask template rendering and interacting with the MongoDb database.
* MongoDb 
    * For Creating, Reading, Updating and Deleting data (:user data, poem data and 'theme' data').
* Flask
    * For template rendering.
* ajax
    * For posting to the database without loading a page. (e.g.: search bar)

_Stylesheet and script plugins used:_
* https://fonts.googleapis.com/icon?family=Material+Icons
* https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css
* https://code.jquery.com/jquery-3.5.1.js
* https://www.jacklmoore.com/autosize/
* https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js

## Testing ##

### Validating ###
The website was tested using W3 CSS/HTML validator (validator.w3.org).
Each page's HTML code was run through the validator as well as the CSS code. 

Because of the Jinja and Python used in the HTML, the validator gave a lot of errors that were not valid errors:
* Due to the block extend code; the validator encountered some unclosed elements. They are in fact closed, but the opening/closing elements are divided over to different html files.
* The validator did not except Jinja blocks for url attributes; it threw an error for the use of '{'.

Valid errors that remain unresolved:
* The hidden select field in the collaboration form does not allow a predetermined text input (through Jinja) if there is only one option in the list. The suggestions for resolving the issue (adding a "size" attribute) did not resolve the issue. However: since the field is hidden and only there for future possible expansions, where possibly there will be multiple themes to select as options, I have decided to leave it as is: it does not interfere with the functionality of the website.
* The hidden "Allow Collaboration" field in the collaboration form does not accept the ID ("edit_YN") of a hidden field. Since the field is hidden for a reason and may possibly come into being in a future version, I've chosen to leave it as is, as it does not interfere with the website functionality. 

The CSS validator came through clean with the exception that it could not validate the calculation formulas used in the height attributes:
* e.g.: "Invalid number : height Parse Error 100*var(--vh, 1vh) - 205px)"

The main.js file was passed through jshint linter. It brought up a lot of non-issues: missing semi-colons, unnecessary semi-colons, E6 required. All non-issues. Though it does remind me that I have to look in to how to appropriately use semi-colons in js again.

### Testing User Stories ###

* As a user, I want to create a poem and share it online.
    1. Open website on homepage.
    2. Click on the "Create" button".
    3. Fill out the form with poem.
    4. Click the "Publish" button.
* As a user, I want to collaborate on a poem.
    1. Find a poem to collaborate on, either by selecting from the title list, looking up in the search bar, or looking one up via the themes or author selection. Not all poems are "collaboratable", depending on the setting choice of the original author.
    2. Open the poem by clicking on the title name.
    3. Click the Collaborate button at the bottom of the poem.
    4. Fill out the form and adjust the poem to collaborate (the title field is not adjustable).
    5. Click the submit button.
* As a user, I want to read poems that others have published in the app.
    1. Open website on the homepage.
    2. Browse through the poems using one of these options:
        * Search bar: enter a text to search the titles by.
        * Themes: click the themes button and select a theme to find titles of poems by.
        * Authors: click the authors button and select an author whose poems you want to read.
        * Titles: click the titles button and see a list of all the titles in the database.
    3. Click on the poem title you wish to read.
* As a user, I want to delete poems that I have published.
    1. Look up your poem using one of the methods seen above.
    2. Click the delete button.
    3. Enter your username and password.
    4. Click the delete button.
* As a user, I want to see the version history of a poem.
    1. Navigate to a poem using one of the methods seen above.
    2. If the poem has a version history, the "Version" header will be visible at the bottom of the poem.
    3. Click on the "Version" header or on the version number next to it. A version history navigation menu will appear.
    4. Click on the arrows or the numbers of the navigation menu OR use the left and right arrow on your keyboard to navigate through the collaboration history.

### Testing Website responsiveness ###

The website was designed to have different layouts that are appropriate for respectively a phone, tablet or desktop device. In the design process I used an iPhone X, an iPad and an iPad Pro as my handheld device models. I also checked how the application rendered in 4k.

All pages are tested by having them display in the respective format sizes. They are also tested by making the width/height of the window gradually smaller to check if no weird "in between" layout transition issues occur.

### Testing Website Forms and Password Security ###

All forms were tested extensively by:
* Trying to submit form without having filled in all fields. (using button and return key)
* Trying to go back to the first part of the form, changing inputs to none (invalid) and then trying to submit it (not possible also because the button to the second part is then disabled).
* Trying to submit using invalid username. (In case of "new user" a username that already exists, in case of "Existing User" a username that does not exist).
* Trying to submit using an invalid password.
* Trying to submit using an invalid password automatically generated by the browser cache.
* Trying to submit after filling out all fields validly, then going back and invalidating some inputs by deleting content.
* Trying to submit search bar from from any page configuration.

## Deployment ##

This website was deployed using Heroku and is now accessible here: http://msp3-copo.herokuapp.com/

*(The following deployment explanation was copied from a fellow CI-student: https://github.com/EliasOPrado/data-centric-backend-project)*

To deploy to Heroku there are some steps to be followed:

1. Using the terminal install the ```requirements.txt``` packages with the command ```$ pip install -r requirements.txt```.
2. Add a Procfile with the following content ```web: python app.py```.
3. Commit the new files such as requirements.txt and Procfile.
4. In the Heroku website make a new app tapping on the ```new``` button.
5. Choose the application that was already created.
6. Check if the Heroku application is proper linked to the right repository in Github.
7. Chose the application you want to deploy and click on ```config vars```.
   - Set the `IP: 0.0.0.0`
   - Set the `PORT: 5000`
   - Set your `SECRET_KEY: <secret key>`
   - Set the `MONGO_DBNAME: <your mongodb name>`
   - Set the `MONGO_URI: mongodb+srv://<username>:<password>@myfirstcluster-wegta.mongodb.net/CoPoDB?retryWrites=true&w=majority`

8. On the ```app.py``` set the config as follow to match the deployment vars:
  ```
  if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=False)
  ```
9. Also the connection of the application with the data base should be displayed:
  ```
  app.secret_key = os.getenv("SECRET_KEY")
  app.config['MONGO_DBNAME'] = os.getenv("ENV_MONGO_DBNAME")
  app.config['MONGO_URI'] = os.getenv("ENV_MONGO_URI")
  ```
10. Install the [Heroku-CLI](https://devcenter.heroku.com/articles/heroku-cli).
11. Bash commands to deploy:
  ```
  $ heroku login
  $ git add .
  $ git commit -am "make it better"
  $ git push heroku master
  ```

### Cloning & Forking ###

The source code of the project is stored and viewable on github: https://github.com/MauRuRo/MSP3-CoPo. 
Interested parties can Clone and Fork the project by following the steps in these instructions laid out by GitHub:
https://docs.github.com/en/github/getting-started-with-github/fork-a-repo

To run the project locally, the developer needs to create their own database and follow the following steps *(explanation copied from fellow CI-student: https://github.com/EliasOPrado/data-centric-backend-project)*:

1. From the following link https://github.com/MauRuRo/MSP3-CoPo direct download this project or git clone into your directory.
2. With the project already open in your IDE create a `virtual environment` with the following commands:
   1. Create the virtual environment: `$ python3 -m venv venv` in root.
   2. Activate the virtual environment: `$ source venv/bin/activate`
   3. After activated your directory will be displayed like this: `(venv) <your/directory/path> $`
3. Create a file to hold the project configuration locally: `$ touch venv.py`
4. Into the `venv.py` folder add the following configs:
   ```
   import os

   os.environ.setdefault('SECRET_KEY', '<your secret key>')
   os.environ.setdefault('ENV_MONGO_DBNAME', '<your db name>')
   os.environ.setdefault('ENV_MONGO_URI', 'mongodb+srv://<username>:<password>@cluster0-0oagu.gcp.mongodb.net/<your mongodb name>?retryWrites=true')
   os.environ.setdefault('IP', '0.0.0.0')
   os.environ.setdefault('PORT', '5000')
   ```
5. Create a `.gitignore` file and add `venv.py` and `venv/` directory in it.
6. After the setup to run the local server do the following command: `$ python app.py run`

### Deployment Issues ###

An issue that arose is that on a mobile device (iPhone X in my case) the viewer height calculation incorporates the browser buttons and address bar; the main div height is there for set to large proportionately, resulting in the fixed footer at the bottom covering/crossing the contents of the main div.

## Credits ##
### Content ##
For the design of the website I've used a few images that I've found on the web. I've listed them here:
* https://www.pinterest.cl/pin/630363279074092921/
* https://nl.pinterest.com/pin/857724691518034724/
* https://www.freepik.com/free-vector/colorful-geometric-feather_716154.htm

To develop and test the website I've created and collaborated numerous poems, the contents of which are mostly inspired nonsense.
I've also uploaded some published poetry and have accredited each of those to the corresponding author in the app.

To view an example of a poem that's been collaborated on I suggest to look up the poem "New Beginnings". To view an example of a poem that's set for non-collaboration I suggest to look up "Invictus".

### Acknowledgements ###
For some coding issues I found solutions on the web. I'm listing my sources here and I refer to them in the code by comment where they are used:
* https://www.jacklmoore.com/autosize/
* https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
* https://www.bogotobogo.com/python/Flask/Python_Flask_with_AJAX_JQuery.php
* https://stackoverflow.com/questions/17925674/jinja2-local-global-variable/17926422
* https://www.w3schools.com/howto/howto_css_placeholder.asp
* https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
* https://learn.getgrav.org/16/forms/forms/how-to-ajax-submission
* https://github.com/EliasOPrado/data-centric-backend-project
* https://html-online.com/articles/smart-404-error-page-redirect/

