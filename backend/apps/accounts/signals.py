from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserProfile, UserGamificationProfile

@receiver(post_save, sender=User)
def create_user_related_profiles(sender, instance, created, **kwargs):
    """
    Ensure UserProfile and UserGamificationProfile exist for every User.
    """
    if created:
        UserProfile.objects.get_or_create(
            user=instance,
            defaults={
                'first_name': '',
                'last_name': ''
            }
        )
        UserGamificationProfile.objects.get_or_create(
            user=instance,
            defaults={
                'total_xp': 0,
                'tier_badge': 'Bronze'
            }
        )
