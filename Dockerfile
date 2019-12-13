FROM node:latest

WORKDIR /app

# Bundle app source
COPY . .
ARG REACT_APP_PROXY_URL
ENV REACT_APP_PROXY_URL=$REACT_APP_PROXY_URL
RUN echo "Environment variable REACT_APP_PROXY_URL: " && echo "$REACT_APP_PROXY_URL"
RUN echo "Current directory is: " && pwd
RUN npm i
RUN npx lerna bootstrap
RUN npm run build
CMD [ "npm", "run", "start"]
