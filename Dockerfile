# Present Website 
# ---------------

#Baase Image - ubuntu with node 0.10.23
FROM danscan/node

#ADD current repo to /var/app 
ADD . /var/app

#Delete Node Modules
RUN rm -r /var/app/node_modules

#Download Dependencies
RUN cd /var/app && npm install 

# The top-level application command that this container should wrap
ENTRYPOINT cd /var/app && node server.js


