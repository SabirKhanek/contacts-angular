# Base image specification
FROM node:alpine

# Set working directory and configure directory
# RUN addgroup -S app && adduser -S -G app app
# USER app
WORKDIR /home/app

# Copy package.json and install dependencies seperately for faster builds
COPY ./server/package*.json ./
RUN npm install


# Build angular frontend in ./app directory using npm install in that directory and then ng build and copy the dist folder to the image (./app/public)
## Create a public directory for static files and move the dist folder to it
RUN mkdir public
## Create a temporary directory for the angular app and move to it and build after installing dependancies
RUN mkdir app
WORKDIR /home/app/app
COPY ./app/package*.json ./
RUN npm install
COPY ./app .
RUN npm run build

## Move the dist folder to the public directory
RUN mv ./dist/app/* /home/app/public/

## reverting the working directory to the app directory and removing the app directory
WORKDIR /home/app
RUN command rm -rf app

# Copy the rest of the files and set the environment variables
COPY ./server .

# Expose the port and start the server
EXPOSE 3000

CMD ["node", "index.js"]

