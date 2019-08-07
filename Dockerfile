FROM node:10.16.1


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

## Waits for database connection to be ready for receiving connections
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD ["npm", "start"]