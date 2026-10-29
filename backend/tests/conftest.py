import asyncio
import pytest
from app.database.session import init_db

@pytest.fixture(scope="session", autouse=True)
def init_test_database():
    asyncio.run(init_db())
