FROM node:23.5.0
WORKDIR server/build
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build:docker
COPY . .


RUN mkdir ./dist/storage
RUN mkdir ./dist/storage/images
RUN mkdir ./dist/storage/charts
RUN mkdir ./dist/storage/documents
RUN mkdir ./dist/storage/uploads

EXPOSE 8000
CMD ["npm", "run", "start:docker"]