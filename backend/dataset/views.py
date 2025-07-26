import json
from pathlib import Path

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.

BASE_DIR = Path(__file__).resolve().parent
NITRATE_DATASET_PATH = (
    BASE_DIR / "../data/CE01ISSP_nitrate_binned_baseline_subtracted_2014-04-17_2023-09-17_with_dndt_resampled.nc"
)


class NitrateDatasetView(APIView):
    """View to handle requests for the Nitrate dataset."""

    def get(self, request: Request):
        """Handle GET requests to retrieve the Nitrate dataset for a given year.

        Query parameter `year` can be used to specify the year for which the nitrate data is requested.
        If no year is specified, it defaults to 2021. The dataset is filtered by the specified year.

        Args:
            request (rest_framework.request.Request): The HTTP request object.

        Returns:
            response (rest_framework.response.Response): A response containing the nitrate data for the specified year.

        """
        default_year = 2021
        year = request.query_params.get("year") or default_year
        # Validate the year range
        min_year = 2014
        max_year = 2023
        year = int(year)
        if year < min_year or year > max_year:
            data = {
                "message": f"Year {year} is out of range. Please specify a year between {min_year} and {max_year}.",
                "data": {},
            }
            return Response(data, status=400)
        with Path.open(BASE_DIR / f"../data/nitrate_data_{year}.json") as f:
            nitrate_data = json.load(f)
        data = {
            "message": "Nitrate dataset retrieved successfully.",
            "data": nitrate_data,
        }
        return Response(data)


class WindNitrateChlorophyllDatasetView(APIView):
    """View to handle requests for the Wind Nitrate dataset."""

    def get(self, request: Request):
        """Handle GET requests to retrieve the Wind Nitrate dataset.

        Returns:
            response (rest_framework.response.Response): A response containing the Wind Nitrate data.

        """
        with Path.open(BASE_DIR / "../data/wind_nitrate_chlorophyll.json") as f:
            wind_nitrate_chlorophyll_data = json.load(f)
        data = {
            "message": "Wind Nitrate dataset retrieved successfully.",
            "data": wind_nitrate_chlorophyll_data,
        }
        return Response(data)


class MonthlyNitrateDatasetView(APIView):
    """View to handle requests for the Monthly Nitrate dataset."""

    def get(self, request: Request):
        """Handle GET requests to retrieve the Monthly Nitrate dataset.

        Returns:
            response (rest_framework.response.Response): A response containing the Monthly Nitrate data.

        """
        with Path.open(BASE_DIR / "../data/monthly_nitrate.json") as f:
            monthly_nitrate_data = json.load(f)
        data = {
            "message": "Monthly Nitrate dataset retrieved successfully.",
            "data": monthly_nitrate_data,
        }
        return Response(data)
