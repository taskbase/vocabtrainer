FROM python:3.10.13-slim

RUN apt -y update && apt -y upgrade && rm -rf /var/lib/apt/lists/*

WORKDIR /server
COPY ./requirements.txt /server/requirements.txt
RUN pip -q install --no-cache-dir --upgrade -r /server/requirements.txt
COPY ./src /server/src
COPY __init__.py /server/__init__.py

EXPOSE 51337

CMD ["PYTHONPATH=./src", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "51337"]
