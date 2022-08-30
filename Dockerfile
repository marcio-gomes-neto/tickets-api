FROM node:14-alpine 

WORKDIR /api

ARG ms
ENV ms=$ms

ADD package.json /api
ADD yarn.lock /api

ADD global/package.json /api/global/
ADD global/build/ /api/global/build/

ADD services/$ms/package.json /api/service/$ms/
ADD services/$ms/build/ /api/service/$ms/build/
ADD services/$ms/yarn.lock /api/service/$ms/
ADD services/$ms/.env /api/service/$ms/

ADD entry.sh /api/
RUN chmod +x /api/entry.sh

EXPOSE 5000

ENTRYPOINT [ "sh", "/api/entry.sh" ]