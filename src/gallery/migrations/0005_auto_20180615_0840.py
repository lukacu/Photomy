# Generated by Django 2.0.4 on 2018-06-15 08:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0004_album'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='images',
            field=models.ManyToManyField(blank=True, to='gallery.Image'),
        ),
    ]
