# Generated by Django 2.0.4 on 2018-06-07 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('identifier', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='identitygroup',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='imageidentitymatch',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
