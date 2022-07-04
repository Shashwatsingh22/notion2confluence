FROM node:alpine
WORKDIR /usr/src/app

#Copy the required the package file to start lib installation
COPY package*.json ./

#install extact version
RUN npm ci

#Now copying complete file by ignoring some file by the help of dockerignore file
COPY . .

#Start the Application
CMD ["npm","start"]
