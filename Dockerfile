FROM  ubuntu


ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y nginx

RUN apt-get install -y software-properties-common \
           language-pack-en-base mcrypt supervisor curl git \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get install -y  tzdata \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

ENTRYPOINT ["/app/docker-entry.sh"]


