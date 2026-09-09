"""python manage.py seed — seeds MongoDB with default admin + demo data."""

import bcrypt
from django.core.management.base import BaseCommand
from api.models import ServiceOffer, ServiceProvider, UserAccount


def _hash(plain):
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


class Command(BaseCommand):
    help = 'Seed the database with admin user, providers, and services.'

    def handle(self, *args, **options):
        self._seed_admin()
        self._seed_providers()
        self._seed_services()
        self.stdout.write(self.style.SUCCESS('✓ Database seeded successfully.'))

    def _seed_admin(self):
        email = 'admin@localservices.com'
        if UserAccount.objects(email=email).first():
            self.stdout.write(f'  Admin {email} already exists – skipped.')
            return
        UserAccount(name='Admin', email=email, password=_hash('admin123'), role='admin', active=True).save()
        self.stdout.write(f'  Created admin: {email} / admin123')

    def _seed_providers(self):
        providers = [
            dict(name='Rajan Plumbing Services', location='T. Nagar, Chennai', specialty='Plumbing',
                 phone='+91-98765-11111', email='rajan.plumbing@example.com', rating=4.9, jobs_completed=312, experience_years=12, verified=True),
            dict(name='Suresh Electricals', location='Adyar, Chennai', specialty='Electrical',
                 phone='+91-98765-22222', email='suresh.elec@example.com', rating=4.8, jobs_completed=245, experience_years=8, verified=True),
            dict(name='Priya Home Cleaners', location='Velachery, Chennai', specialty='Cleaning',
                 phone='+91-98765-33333', email='priya.clean@example.com', rating=4.7, jobs_completed=198, experience_years=5, verified=True),
            dict(name='Meena Beauty Parlour', location='Anna Nagar, Chennai', specialty='Beauty',
                 phone='+91-98765-44444', email='meena.beauty@example.com', rating=4.9, jobs_completed=421, experience_years=10, verified=True),
            dict(name='Kumar Appliance Repair', location='Tambaram, Chennai', specialty='Repair',
                 phone='+91-98765-55555', email='kumar.repair@example.com', rating=4.6, jobs_completed=176, experience_years=7, verified=True),
            dict(name='Green Thumb Gardeners', location='Sholinganallur, Chennai', specialty='Gardening',
                 phone='+91-98765-66666', email='greenthumb@example.com', rating=4.8, jobs_completed=134, experience_years=6, verified=True),
        ]
        created = 0
        for p in providers:
            if not ServiceProvider.objects(email=p['email']).first():
                ServiceProvider(**p).save()
                created += 1
        self.stdout.write(f'  Providers: {created} created, {len(providers) - created} skipped.')

    def _seed_services(self):
        services = [
            dict(name='Plumbing Repair', category='HOME', city='Chennai',
                 description='Fast leak fixes, pipe installation, and bathroom plumbing support.', icon='fa-faucet', price=49.0, rating=4.9),
            dict(name='Electrical Service', category='REPAIR', city='Chennai',
                 description='Expert wiring, lighting installation, and electrical troubleshooting.', icon='fa-bolt', price=65.0, rating=4.8),
            dict(name='Home Cleaning', category='CLEANING', city='Chennai',
                 description='Deep-cleaning, routine maintenance, and move-in or move-out packages.', icon='fa-broom', price=40.0, rating=4.7),
            dict(name='Hair & Beauty', category='BEAUTY', city='Chennai',
                 description='Salon styling, facials, and grooming treatments from trusted experts.', icon='fa-scissors', price=55.0, rating=4.9),
            dict(name='Appliance Fix', category='REPAIR', city='Chennai',
                 description='Repair and tune-up for washing machines, ovens, and kitchen devices.', icon='fa-wrench', price=58.0, rating=4.6),
            dict(name='Garden Care', category='HOME', city='Chennai',
                 description='Lawn care, plant maintenance, and seasonal outdoor support.', icon='fa-leaf', price=45.0, rating=4.8),
        ]
        created = 0
        for s in services:
            if not ServiceOffer.objects(name=s['name'], city=s['city']).first():
                ServiceOffer(**s).save()
                created += 1
        self.stdout.write(f'  Services: {created} created, {len(services) - created} skipped.')
