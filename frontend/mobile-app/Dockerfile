FROM node:alpine AS build

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm install -g expo-cli @expo/ngrok@^4.1.0
EXPOSE 19000 19001 19002
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
CMD ["npm", "start"]
