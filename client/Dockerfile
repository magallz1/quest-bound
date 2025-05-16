FROM node:23.5.0

# Set the working directory inside the container
WORKDIR /build
 
# accept these at build time just so the container knows about them
ARG VITE_API_ENDPOINT
ARG VITE_DOMAIN

# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# copy the template into the final build‐dir
COPY public/env.template.js public/env.template.js

RUN npm run build
 
# Expose the port your app runs on
EXPOSE 5173
 
# Define the command to run your app
#CMD ["npm", "run", "start"]
CMD sh -c "\
  sed \
    -e 's|__VITE_API_ENDPOINT__|${VITE_API_ENDPOINT}|g' \
    -e 's|__VITE_DOMAIN__|${VITE_DOMAIN}|g' \
    public/env.template.js > dist/env.js && \
  npm run start"
