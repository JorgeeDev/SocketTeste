docker build -t trux.websocket .
docker tag trux.websocket uxregistry.azurecr.io/trux.websocket
docker push uxregistry.azurecr.io/trux.websocket