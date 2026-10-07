from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, UserGamificationProfile, UserSkill, SkillMaster


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'User Profile'
    fk_name = 'user'


class UserGamificationInline(admin.StackedInline):
    model = UserGamificationProfile
    can_delete = False
    verbose_name_plural = 'Gamification Profile'
    fk_name = 'user'


class UserSkillInline(admin.TabularInline):
    model = UserSkill
    extra = 1


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'role', 'is_active', 'is_verified', 'is_staff', 'created_at')
    list_filter = ('role', 'is_active', 'is_verified', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info & Role', {'fields': ('role',)}),
        ('Permissions', {'fields': ('is_active', 'is_verified', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'role', 'is_active', 'is_staff'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    inlines = (UserProfileInline, UserGamificationInline, UserSkillInline)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'college_name', 'degree', 'target_role', 'is_onboarded_display')
    search_fields = ('user__email', 'first_name', 'last_name', 'college_name', 'target_role')
    list_filter = ('degree', 'graduation_year', 'college_tier')

    def is_onboarded_display(self, obj):
        return obj.is_onboarded
    is_onboarded_display.boolean = True
    is_onboarded_display.short_description = 'Onboarded'


@admin.register(UserGamificationProfile)
class UserGamificationProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_xp', 'tier_badge', 'current_streak_days', 'longest_streak_days', 'last_active_date')
    search_fields = ('user__email', 'tier_badge')
    list_filter = ('tier_badge',)


@admin.register(SkillMaster)
class SkillMasterAdmin(admin.ModelAdmin):
    list_display = ('canonical_name', 'category', 'is_verified', 'created_at')
    search_fields = ('canonical_name',)
    list_filter = ('category', 'is_verified')


@admin.register(UserSkill)
class UserSkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'proficiency', 'source', 'verified', 'score')
    search_fields = ('user__email', 'skill__canonical_name')
    list_filter = ('proficiency', 'source', 'verified')
