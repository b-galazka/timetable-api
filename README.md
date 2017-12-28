# Lessons timetable API and scraper

Scraper downloads list of all required HTML documents from http://80-sochaczew.pl/dla_uczniow/plan/lista.html, then downloads all of them and generates a timetable (also timetable of teachers and classrooms), which is saved to the database.

# Routes

All routes respond with a JSON.
All not existing routes (or existing with an invalid param provided) respond with 404 HTTP status code and `not found` message;
All existing routes responds with 500 HTTP status code and `something went wrong` message when an unknown error has occured.
Authorization header must be in `Basic credentials` format where `credentials` is a login:password base64 encoded string.

## GET /classes

Responds with an array of all classes objects sorted ascending by slug.
Schema of each object in array:

{  
&nbsp;&nbsp;&nbsp;&nbsp;slug: string,  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string  
}  

## GET /classes/:slug

Responds with a class object of provided slug.
Schema of a response:

{  
&nbsp;&nbsp;&nbsp;&nbsp;slug: string,  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string,  
&nbsp;&nbsp;&nbsp;&nbsp;type: "class",  
&nbsp;&nbsp;&nbsp;&nbsp;update: datetime ISO string,  

&nbsp;&nbsp;&nbsp;&nbsp;timetable: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0-4 number of a day]: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0-n number of a lesson]: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[index]: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;subject: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;classroom: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;teacherName: string or null,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;teacherSlug: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_id: string  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] or [null]  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] or an empty array  

&nbsp;&nbsp;&nbsp;&nbsp;]  
}  

## GET /classrooms

Responds with an array of all classrooms objects sorted ascending by number (as string);
Schema of each classroom object in array:

{  
&nbsp;&nbsp;&nbsp;&nbsp;number: string,  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string  
}  

## GET /classrooms/:number

Responds with a classroom object of provided number.
Schema of a response:

{  
&nbsp;&nbsp;&nbsp;&nbsp;slug: string,  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string,  
&nbsp;&nbsp;&nbsp;&nbsp;type: "classroom",  
&nbsp;&nbsp;&nbsp;&nbsp;update: datetime ISO string,  

&nbsp;&nbsp;&nbsp;&nbsp;timetable: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0-4 number of a day]: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0-n number of a lesson]: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[index]: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;subject: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;class: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;teacherName: string or null,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;teacherSlug: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_id: string  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] or [null]  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] or an empty array  

&nbsp;&nbsp;&nbsp;&nbsp;]  
}  

## GET /teachers

Responds with an array of all teachers objects sorted ascending by lastname.
Schema of each object in array:

{  
&nbsp;&nbsp;&nbsp;&nbsp;slug: string,  
&nbsp;&nbsp;&nbsp;&nbsp;name: string,  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string  
}  

## GET /teachers/:slug

Responds with a teacher object of provided slug.
Schema of a response:

{  
&nbsp;&nbsp;&nbsp;&nbsp;slug: string,  
&nbsp;&nbsp;&nbsp;&nbsp;name: string or null,  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string,  
&nbsp;&nbsp;&nbsp;&nbsp;type: "teacher",  
&nbsp;&nbsp;&nbsp;&nbsp;update: datetime ISO string,  

&nbsp;&nbsp;&nbsp;&nbsp;timetable: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0-4 number of a day]: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[0-n number of a lesson]: [  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[index]: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;subject: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;classroom: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;class: string,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_id: string  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] or [null]  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] or an empty array  

&nbsp;&nbsp;&nbsp;&nbsp;]  
}  

## GET /hours

Responds with an array of all lesson hours.
Schema of each object in array:

{  
&nbsp;&nbsp;&nbsp;&nbsp;start: string in `hh:mm` or `h:mm` format  
&nbsp;&nbsp;&nbsp;&nbsp;end: string in `hh:mm` or `h:mm` format  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string  
}  

## GET /mobile-app

Responds with data about mobile application.
Schema of a response:

{  
&nbsp;&nbsp;&nbsp;&nbsp;_id: string,  
&nbsp;&nbsp;&nbsp;&nbsp;version: string in \d{1,3}.\d{1,2} format,  
&nbsp;&nbsp;&nbsp;&nbsp;message: string,  
&nbsp;&nbsp;&nbsp;&nbsp;changelog: array of strings  
}  

## PUT /mobile-app

Updates (or adds if there's no data in database) informations about mobile application. Responds with added data or data before and after update.
Authorization header and request body are required.

Schema of a request body (at least one field is required):

{  
&nbsp;&nbsp;&nbsp;&nbsp;version: string in \d{1,3}.\d{1,2} format,  
&nbsp;&nbsp;&nbsp;&nbsp;message: string,  
&nbsp;&nbsp;&nbsp;&nbsp;changelog: array of strings  
}  

## PUT /mobile-app/users

Adds (or updates if user already exists) mobile application user to the database. Responds with added data or data before and after update.
Authorization header and request body are required.

Schema of a request body (only phoneID and phoneModel fields are required):

{  
&nbsp;&nbsp;&nbsp;&nbsp;phoneModel: string,  
&nbsp;&nbsp;&nbsp;&nbsp;phoneID: string,  
&nbsp;&nbsp;&nbsp;&nbsp;appVersion: string,  

&nbsp;&nbsp;&nbsp;&nbsp;mostPopularTimetable: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: "teacher", "class" or "classroom",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;slug: string  
&nbsp;&nbsp;&nbsp;&nbsp;}  
}  

## PUT /timetable

Generates a new timetable and saves it to the database. Responds with `updated` message.
Authorization header is required.

## PUT /request-update

This route allows applications users to update out-of-date timetable.
Checks if there are any changes in the timetable. If they are, generates new timetable and saves it to the database. It also saves requestor phone ID, request datetime and information if timetable has been updated. 
Changes are checked only one time per hour by default (it can be set in config.json file).
Assuming that valid headers and request body have been sent, it can respond with `updated` message (200 HTTP status code) or one of: `no changes in timetable detected`, `your request cannot be processed, because of time limit` and 403 HTTP status code.
Authorization header and request body are required.

Schema of a request body:

{  
&nbsp;&nbsp;&nbsp;&nbsp;phoneID: string  
}  

# How to use:

1. Run `npm install` command.
2. Set secrets, IP, port, allowed domains and MongoDB URL in config.json file.
3. Create API user, which has to be an object with `username` and `password` fields. Use functions/hash.js to generate a password hash.
4. Run `npm start` or `npm run start-dev`.

<hr>

React application which uses this API is available <a href="https://github.com/b-galazka/timetable-spa-react">here</a>.