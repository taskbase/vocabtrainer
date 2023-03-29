FROM python:3.7.12-slim-buster

RUN apt -y update && apt -y upgrade && rm -rf /var/lib/apt/lists/*

COPY server /server

WORKDIR /server


RUN pip install -q --no-cache-dir --upgrade -r requirements.txt && \
    apt -u update && \
    apt -y upgrade && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 51337

CMD ["PYTHONPATH=./src", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "51337"]