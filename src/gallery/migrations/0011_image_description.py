# Generated by Django 2.0.4 on 2018-06-24 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0010_image_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='description',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
