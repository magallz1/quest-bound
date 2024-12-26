FROM node:23.5.0

# Set the working directory inside the container
WORKDIR /build
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

RUN npm run build
 
# Expose the port your app runs on
EXPOSE 5173
 
# Define the command to run your app
CMD ["npm", "run", "start"]