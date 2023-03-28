# Book-Market-Portal
MY THESIS

# CREDIT FIRST INIT
- In the first to set up project backend and auto-generate default project file, run the command:
```
docker-compose run <service-backend> django-admin startproject <project-name> .

```
note that above command only works while running in container based on python image based. Notice for the dot symbol at the end of statement.
- In the first to set up project frontend and auto-generate default app file, run the command:
```
docker-compose run <service-frontend> npx create-react-app <app-name>

```
note that above command only works while running in container based on node image based.
- Change the permission of auto-generated files, run command:
```
sudo chwon $USER:$USER -R .

```