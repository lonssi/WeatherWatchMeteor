FROM weatherwatch-base

# Build app and install fibers
RUN cd /app && meteor build --directory /build --architecture os.linux.x86_64 --unsafe-perm \
    && cd /build/bundle/programs/server && meteor npm install

# Exposed port 5000 will be automatically configured with vhost/nginx
ENV PORT 5000
EXPOSE 5000
ENV NODE_ENV production

WORKDIR /build/bundle
CMD /usr/bin/node main.js
