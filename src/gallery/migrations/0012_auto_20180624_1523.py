# Generated by Django 2.0.4 on 2018-06-24 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0011_image_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='albums', to='gallery.Image'),
        ),
    ]
