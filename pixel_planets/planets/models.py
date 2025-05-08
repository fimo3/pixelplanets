from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

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
    liquid_percent = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentage of the planet's surface covered by liquid (0-100)"
    )
    liquid_color = models.CharField(
        max_length=7,
        default='#1E90FF',  # Dodger blue as default
        help_text="HEX color code for the liquid (e.g., #1E90FF)"
    )
    land_color = models.CharField(
        max_length=7,
        default='#1E90FF',  # Dodger blue as default
        help_text="HEX color code for the liquid (e.g., #1E90FF)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']