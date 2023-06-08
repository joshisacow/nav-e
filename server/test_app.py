from main import app

with app.test_client() as c:
    response = c.get('/test')
    assert response.data.decode('utf-8') == 'success'
    assert response.status_code == 200