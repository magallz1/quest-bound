FROM node:23.5.0
WORKDIR server/build
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build:docker

run mkdir /storage
run mkdir /storage/images
run mkdir /storage/charts
run mkdir /storage/documents
run mkdir /storage/uploads

EXPOSE 8000
CMD ["npm", "run", "start:docker"]