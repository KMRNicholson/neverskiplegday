FROM node:7
RUN mkdir /neverskiplegday
ADD . /neverskiplegday
WORKDIR /neverskiplegday
RUN npm i
EXPOSE 80
CMD ["npm", "start"]