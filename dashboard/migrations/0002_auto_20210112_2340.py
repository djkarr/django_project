# Generated by Django 3.1.4 on 2021-01-12 23:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Goals',
            new_name='Goal',
        ),
    ]