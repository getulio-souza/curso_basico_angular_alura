FROM nginx
MAINTAINER Leonardo Souza Barroso <lsouza@alis-sol.com.br>

COPY ./dist /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf
