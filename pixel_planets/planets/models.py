from django.db import models

TERRAIN_CHOICES = [
    ('rocky', 'Rocky'),
    ('icy', 'Icy'),
    ('gaseous', 'Gaseous'),
    ('desert', 'Desert'),
    ('jungle', 'Jungle'),
]

class Planet(models.Model):
    name = models.CharField(max_length=50)
    seed = models.CharField(max_length=64, unique=True)
    terrain = models.CharField(max_length=20, choices=TERRAIN_CHOICES)
    atmosphere_color = models.CharField(max_length=7)  # HEX code like #AABBCC
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
