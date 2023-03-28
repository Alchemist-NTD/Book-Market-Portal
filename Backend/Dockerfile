FROM python:3.8-slim-buster

RUN mkdir /src

WORKDIR /src

COPY requirements.txt /src/

RUN pip3 install -r requirements.txt

RUN apt-get update && apt-get install -y cron

COPY . /src
