# Bulletin Board
RESTful API for a bulletin board.

## Project configurating and launching:

### Install
npm install

### Configurate
Make a copy of "**ormconfig-example.json**" file and rename it as "**ormconfig.json**"

![Ormconfig](/images/ormconfig.PNG)

Fill in the data for your desired database, leave the synchronize as **True** while you're doing development.

Your project should now be good to run.
### Compile
npm run tsc

### Run
dev: npm run dev</br>prod: npm run prod


# Routing

## posts

### /post
GET</br>
POST
### /post/:id
UPDATE</br>
DELETE
