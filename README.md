Juntar (codename peach) is a libre-software Facebook application with the
commitment to facilitate the process to give and receive donations.

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
