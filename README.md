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

# Insert Database
```
psql -U postgres_admin_duy -d book_db -f /home/books.sql

psql -U postgres_admin_duy -d book_db -f /home/users.sql

psql -U postgres_admin_duy -d book_db -f /home/ratings.sql

psql -U postgres_admin_duy -d book_db -f /home/sim.sql
```

# TEST BANK CARD
NH: NCB

ST: 9704198526191432198

TCT: NGUYEN VAN A

NPH: 07/15

OTP: 123456