# Generated by Django 2.0.4 on 2018-06-05 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='lqip_upload',
            field=models.FileField(default=None, upload_to=''),
            preserve_default=False,
        ),
    ]
