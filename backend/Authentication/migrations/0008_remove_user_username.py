# Generated by Django 5.1.7 on 2025-04-02 21:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Authentication', '0007_history_analysis_summary'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
    ]
