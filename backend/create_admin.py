from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()
admin = User(full_name='Admin', email='admin@devhire.com', hashed_password=hash_password('admin123'), role='admin')
db.add(admin)
db.commit()
print('Admin created!')
