FROM node

WORKDIR /app

COPY package*.json ./

ENV DB_URL=mysql://BulletinBoarder:fjWvxuY4edDwGiAv6qOa6@host.docker.internal:3306/relaa
ENV DB_NAME=relaa
ENV DB_SYNCHRONIZE=true
ENV DB_LOGGING=false
ENV PORT=3000

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

EXPOSE 3000

