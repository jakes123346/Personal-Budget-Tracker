# Personal Budget Tracker

 <!-- Django + React Personal Budget Tracker -->

 A full-stack Personal Budget Tracker app built with **Django REST Framework (DRF)** and  **ReactJS**. It allows authenticated users to manage **Categories**, **Budgets**, and **Transactions**, with JWT-based authentication.

 ## Features

 - User authentication with JWT (Login / Logout)
 - CRUD operations for:
    - Categories
    - Budgets
    - Transactions
- Token-based access control -- users only see their own data
- Responsive UI with Bootstrap
- SQLite database for persistence


## Tech Stack
| Layer     | Technology |
|-----------|------------|
| Backend   | Django, Django REST Framework, SimpleJWT|
| Frontend  | ReactJS (Bootstrap + Axios) |
| Database  | SQLite |
| Auth      | JWT (JSON Web Tokens) |


## Backend Setup (Django)

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate        #(Windows: venv\Scripts\activate)

# 2. Install dependencies
pip install django djangorestframework djangorestframework-simplejwt

# 3. Start project
# below command is just an example of project name, you can give any name as per your choice.
django-admin startproject budget_tracker 
cd budget_tracker
# below command is just an example of app name, you can give any name as per your choice.
python manage.py startapp transactions 

# 4. Add 'transactions' and 'rest_framework' to INSTALLED_APPS

# 5. Run migrations
python manage.py makemigrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Run server
python manage.py runserver


## Frontend Setup (React)

# In a separate folder
npm create vite@latest frontend
cd frontend

# Install dependencies
npm install axios bootstrap react-router-dom

# Start dev server
npm start

