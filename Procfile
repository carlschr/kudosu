web: gunicorn --pythonpath sudoku_app sudoku_app.wsgi:application --log-file
python manage.py collectstatic --noinput
manage.py migrate