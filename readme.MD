# Bulletin Board

RESTful API for a bulletin board.

## Project configurating and launching:

### Install

npm install

### Configurate

Make a copy of "**.env-example**" file and rename it as "**.env**"

For local development environment replace the **DB\_** values with your local ones.

Example: ![Env](/images/envexample.PNG)

If it is necessary for you to make changes in your database, leave the value of synchronize as **True**.

NOTE: In case you're running the project in production mode, switch the value of ENTITIES to **_./build/entities/\*.js_**

To keep logs from updating in git, run:

**git update-index --assume-unchanged logs/info.log**

**git update-index --assume-unchanged logs/error.log**

Your project should now be good to run.

### Compile

npm run tsc

### Run

dev: npm run dev</br>prod: npm run prod
