FROM node:13.3.0-stretch

WORKDIR /app

# Bundle app source
COPY . .

ARG REACT_APP_PROXY_URL
ENV REACT_APP_PROXY_URL=$REACT_APP_PROXY_URL

ARG EXPRESS_GATEWAY_ADMIN_URL
ENV EXPRESS_GATEWAY_ADMIN_URL=$EXPRESS_GATEWAY_ADMIN_URL

ARG PROXY_PORT
ENV PROXY_PORT=$PROXY_PORT

RUN echo "Environment variable REACT_APP_PROXY_URL: $REACT_APP_PROXY_URL"
RUN echo "Environment variable EXPRESS_GATEWAY_ADMIN_URL: $EXPRESS_GATEWAY_ADMIN_URL"
RUN echo "Environment variable PROXY_PORT: $PROXY_PORT"

RUN echo "Current directory is: " && pwd
RUN npm i
RUN npx lerna bootstrap
RUN npm run build
CMD [ "npm", "run", "start"]
