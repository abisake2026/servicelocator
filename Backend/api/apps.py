"""Connect mongoengine to MongoDB on Django startup."""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        import mongoengine
        from django.conf import settings
        mongoengine.connect(
            db=settings.MONGO_DB_NAME,
            host=settings.MONGO_URI,
        )
