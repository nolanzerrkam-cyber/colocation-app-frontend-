FROM nginx:alpine

COPY CSS /usr/share/nginx/
COPY html /usr/share/nginx/
COPY JS /usr/share/nginx/
COPY assets /usr/share/nginx/
COPY image /usr/share/nginx/

EXPOSE 80
