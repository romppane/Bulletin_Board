FROM node

WORKDIR /app

COPY package*.json ./

ENV DB_URL=mysql://root:root@database:3306/testdb
ENV DB_NAME=testdb
ENV DB_SYNCHRONIZE=true
ENV DB_LOGGING=false
ENV PORT=3000

RUN npm install

COPY . .

EXPOSE 3000

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm run dev