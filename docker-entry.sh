#!/bin/bash -x

trap handler SIGINT

handler() {
    	kill -s SIGINT $PID

}

cd /app
npm install
npm install nodemon -g
#npm run setup && npm start
nodemon -e "js,mjs"  --experimental-modules index.js 
