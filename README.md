Juntar (codename peach) is a libre-software Facebook application with the
commitment to facilitate the process to give and receive donations.

Requirements
------------
- NodeJS (download from http://nodejs.org/#download version 6.4 or above)
- NPM (Node Package manager, just follow the instructions https://github.com/isaacs/npm/blob/master/README.md )
- The following npm packages (just do npm install packageName)
	- express
	- facebook-signed-request
	- prototype
	- sequelize
	- stache
  - junar


Database setup
--------------

Install MySQL
  $ sudo apt-get install mysql-server mysql-client

Create database
  $ mysql -uroot -p
    CREATE DATABASE peach;
    GRANT ALL PRIVILEGES ON peach.* to 'admin'@'localhost' IDENTIFIED BY 'admin';

Run the project
---------------

  $ ./startup.sh

If you want to run from your machine instead from Facebook App, then you have to go to the file
src/application/RenderFacebookCommand.js and in the line 1 change

  App.route("/render", { method : "post" }, Class.create({
  
to

  App.route("/render", { method : "get" }, Class.create({


In order to make the view reader to accept render requests from the browser.
Just go to http://localhost:3000/render and you should be able to use the app.