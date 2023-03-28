# Vocitrainer backend

# Install

```shell
pip3 install -r .
```


# Run
First make sure you export the following variables, s.t. the server can pick it up
```shell
export api_key="<your key>"
export tenant_id="<tenant_id, e.g. 99>"
export analytics_api_url="<url, e.g. http://localhost:10000>"
export feedback_api_url = "<url, e.g. http://localhost:60050>"
```

Where:

- `api_key`: is the key to access the LAP
- `tnant_id`: is the key where the tasks are preconfigured and or should be stored when fetching feedback
- `analytics_api_url`: is the url to connect to the analytics engine
- `feedback_api_url`: is the url to connect to the feedback engine

Then inside the `src` folder run
```shell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

