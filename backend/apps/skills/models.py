import uuid
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class SkillCategoryEnum(models.TextChoices):
    TECHNICAL = 'technical', _('Technical')
    DOMAIN = 'domain', _('Domain')
    SOFT = 'soft', _('Soft')
    TOOL = 'tool', _('Tool')


class SkillImportanceEnum(models.TextChoices):
    MANDATORY = 'mandatory', _('Mandatory')
    PREFERRED = 'preferred', _('Preferred')


class SkillMaster(models.Model):
    """
    Skills master taxonomy table matching daksh.skills_master.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    canonical_name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True)
    category = models.CharField(
        max_length=20,
        choices=SkillCategoryEnum.choices,
        default=SkillCategoryEnum.TECHNICAL
    )
    description = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skills_master'
        verbose_name = _('Skill Master')
        verbose_name_plural = _('Skills Master')
        ordering = ['canonical_name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.canonical_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.canonical_name} ({self.category})"


class SkillAlias(models.Model):
    """
    Alternative names/aliases for skills matching daksh.skill_aliases.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    skill = models.ForeignKey(
        SkillMaster,
        on_delete=models.CASCADE,
        related_name='aliases',
        db_column='skill_id'
    )
    alias_name = models.CharField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'skill_aliases'
        verbose_name = _('Skill Alias')
        verbose_name_plural = _('Skill Aliases')

    def __str__(self):
        return f"{self.alias_name} -> {self.skill.canonical_name}"


class RoleSkillRequirement(models.Model):
    """
    Skill requirements mapped to role taxonomy matching daksh.role_skill_requirements.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(
        'jobs.JobRoleTaxonomy',
        on_delete=models.CASCADE,
        related_name='skill_requirements',
        db_column='role_id'
    )
    skill = models.ForeignKey(
        SkillMaster,
        on_delete=models.RESTRICT,
        related_name='role_requirements',
        db_column='skill_id'
    )
    importance = models.CharField(
        max_length=20,
        choices=SkillImportanceEnum.choices,
        default=SkillImportanceEnum.MANDATORY
    )
    benchmark_score_min = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    weightage = models.DecimalField(max_digits=3, decimal_places=2, default=1.00)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'role_skill_requirements'
        verbose_name = _('Role Skill Requirement')
        verbose_name_plural = _('Role Skill Requirements')
        unique_together = ('role', 'skill')

    def __str__(self):
        return f"{self.role.role_title} requires {self.skill.canonical_name} ({self.importance})"
