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

CMD ["npm", "run", "dev"]

EXPOSE 3000

