## 1. Zmienne środowiskowe
Przed buildem należy utworzyć pliki .env w folderze "API" orac "Client"

Przykładowy plik .env dla API:
```
db_username=postgres
db_password=passwd <zgodnie z plikiem yamkl>
db_ip_address=postgres
db_databasename=BudgetApp <zgodnie z plikiem yaml>
db_port=5432
jwt_secret_key=f95df+f489d846fgYGdf44fdsfsd894984gg8gdsf9d8s4fdOUDG
jwt_algorithm=HS256
jwt_expiring_minutes=30
```

Przykładowy plik .env dla Client:
```
API_URL=http://<adres_ip_hosta>:<port ustawiony w pliku yaml>
```

Reszta konfiguracji przebiega w docker-compose.yaml
-ustawić hało i nazwę db dla postgresa,
-sprawdzić czy porządane porty są wystawione

## 2. Uruchomienie aplikacji

aplikację uruchamia się przy użyciu
`docker compose up -d`

przy update:
`docker compose up --build -d`

Łączenie z klientem na ustawionym porcie, domyślnie 5000
Zalecane użycie Nginx dla konfiguracji publicznej
