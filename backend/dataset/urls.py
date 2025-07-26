from django.urls import path

from .views import MonthlyNitrateDatasetView, NitrateDatasetView, WindNitrateChlorophyllDatasetView

# Create a router and register our viewsets with it.

urlpatterns = [
    path("dataset/nitrate/", NitrateDatasetView.as_view()),
    path("dataset/wind-nitrate-chlorophyll/", WindNitrateChlorophyllDatasetView.as_view()),
    path("dataset/nitrate-monthly/", MonthlyNitrateDatasetView.as_view()),
]
