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

iPhone x

<img src="static/images/iPhone X home.png" height="200px" alt="iphonex">

Desktop

<img src="static/images/Desktop home.png" height="200px" alt="desktop">


For this project I've chosen a more or less minimalist design approach, but not strictly minimalist. Due to the little amount of content on the page it was tricky to design something that would come accros normally on especially larger devices/laptops/4k screns. 

The design is centered around mobile device use, where the content fills the screen. However on larger devices there is lot's of empty space to the sides of the centered content. Because I did not want to complicate the web application by creating more content I chose for a design solution. 

The inkt blot patteron on the background in black and white has an abstract feel to it and is relatable to the writing theme (because of the ink) and the creativity theme (because of the messy blots) and therefor matches well witht the page content. The center of the screen is mostly free of blots in order for it not to interfere with the viewing of the page content. I considered a slow animation of the background, slowly become larger/smaller, but decided against it when I discovered it made me nauseous. 

The black/white theme is contrasted subtely by the logo -two crossed writing feathers (stands for two writers collaborating)- which is very colorfull with beautifull complimentary colors. The colorfull logo is partly repeated in the 'Create' (single feather) and 'Collaborate' (crossed feathers) button. 

I consdidered leaving it at that, but the design was still to minimalist for my taste,which I why I implemented a very subtle linear gradient color on the buttons on the main page. The colors fo the linear gradient are sampled from the logo, thus remaining within the color scheme of the page. 

For most text area's on the page I've implementen a very subtle highly transparent white background linear gradient, in order for the background image not to interfere with the viewing of the content.

You can view the original wireframe using this link: https://github.com/MauRuRo/MSP3-CoPo/blob/master/static/images/CoPo%20wireframe%20base.pdf


## Features ##

### Existing Features ###

* Search bar to search by title. The user's input is compared to the titles in the database and titles with partial matches are returned.
* Search by options: Search by Theme, Search by Author, Search by Title.
* Create form: the user can use this form to upload a new poem, either with an existing user account or by creating a new one. Depending on existing/new user the username and password fields are validated differently.
* Collaborate form: the user can use this form to collaborate on a poem and update it on the database, either as an existing or as a new user.
* Users can/must asign a theme to their poem. If theme of choice is not listed, they can add a new theme to the database.
* Users can create/collaborate on poems with one user account, but can change the Author name for each poem individually; that way a user can upload for example a published poem by a famous poet withouth having to create a new account. The author name used on the first upload is stored in the database and will always be returned to the forms when filling out the username and password.
* Delete form: the user can use this form to delete a poem, but only if they are the original author; it's password protected.
* Version history navigation: a log is kept of all the changes made to the poem and by which author. The user can view the version history of a poem. (Navigation also possible by using arrow keys.)

### Features Left to Implement ###

* A rating system that would the user could also sort by.
* A comment section on each poem. 
* A email service that sends notifications to users if their poem has been collaborated on (or commented on).

## Technologies Used ##
* HTML5
  * To give the website content and structure.
* CSS3
  * To design the look and layout of the website.
* JavaScript
  * To enable user interaction with the website.
* jQuery
  * To simpify DOM manipulation.
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
    * For posting to the database without loading a page. (e.g.: searchbar)


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
* The hidden select field in the collaboration form does not allow a predetermined text input (through Jinja) if there is only one option in the list. The suggestions for resolving the issue (adding a "size" attribute) did not resolve the issue. However: since the field is hidden and only there for future possible expansions, where possibly there will be multiple themes to select as options, I have decided to leave it as is: it does not interfere with the funcionality of the website.


The main.js file was passed through jshint linter. It did not bring up any major issues.

### Testing User Stories ###

* As a user, I want to create a poem and share it online.
    1. Open website on homepage.
    2. Click on the "Create" button".
    3. Fill out the form with poem.
    4. Click the "Publish" button.
* As a user, I want to collaborate on a poem.
    1. Find a poem to collaborate on, either by selecting from the title list, looking up in the searchbar, or looking one up via the themes or author selection. Not all poems are "collaboratable", depending on the setting choice of the original author.
    2. Open the poem by clicking on the title name.
    3. Click the Collaborate button at the bottom of the poem.
    4. Fill out the form and adjust the poem to collaborate (the title field is not adjustabel).
    5. Click the submit button.
* As a user, I want to read poems that others have published in the app.
    1. Open website on the homepage.
    2. Browse through the poems using one of these options:
        * Searchbar: enter a text to search the titles by.
        * Themes: click the themes button and select a theme to find titles of poems by.
        * Authors: click the authors button and select an author who's poems you want to read.
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

All pages are tested by having them display in the respective format sizes. They are also tested by making the widht/height of the window gradually smaller to check if no weird "in between" layout transition issues occur.

### Testing Website Forms and Password Security ###

The website was designed to have different layouts that are appropriate for respectively a phone, tablet or desktop device. In the design process I used an iPhone 6/7/8, iPhone SE, an iPad and an iPad Pro as my handheld device models.

All pages are tested by having them display in the respective format sizes. They are also tested by making the widht/height of the window gradually smaller to check if no weird "in between" layout transition issues occur.

## Deployment ##

This website was deployed using Heroku and is now accesible here: http://msp3-copo.herokuapp.com/

This was done by: 
1. Goi%%%%%
2. G%%%%
3. %%%%

### Cloning & Forking ###

How to clone and fork the project...

### Deployment Issues ###

An issue that arose is that on a mobile device (iPhone X in my case) the viewer height calculation incorporates the browser buttons and addressbar; the main div height is there for set to large proportionately, resulting in the fixed footer at the bottom covering/crossing the contents of the main div.

## Credits ##
### Content ##
For the design of the website I've used a few images that I've found on the web. I've listed them here:
* https://www.pinterest.cl/pin/630363279074092921/
* https://nl.pinterest.com/pin/857724691518034724/
* https://www.freepik.com/free-vector/colorful-geometric-feather_716154.htm

To develop and test the website I've created and collaborated numerous poems, the contents of which are mostly inspired nonsense.
I've also uploaded some published poetry and have accreditted each of those to the corresponding author in the app.

### Acknowledgements ###
For some coding issues I found solutions on the web. I'm listing my sources here and I refer to them in the code by comment where they are used:
* https://www.jacklmoore.com/autosize/
* https://www.w3resource.com/javascript-exercises/javascript-string-exercise-9.php
* https://www.bogotobogo.com/python/Flask/Python_Flask_with_AJAX_JQuery.php
* https://stackoverflow.com/questions/17925674/jinja2-local-global-variable/17926422
* https://www.w3schools.com/howto/howto_css_placeholder.asp
* https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
* https://learn.getgrav.org/16/forms/forms/how-to-ajax-submission