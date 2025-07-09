FROM python:3.13-slim

# Setup main directory
RUN mkdir /usr/src/app
# For holding database
RUN mkdir /usr/src/app/data

# Copy files
WORKDIR /usr/src/app
COPY . /usr/src/app/

# Some environment stuff
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DJANGO_SETTINGS_MODULE=api.settings

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
# Compile dependencies
RUN uv pip compile pyproject.toml -o requirements.txt
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the entrypoint script
RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]

EXPOSE 8000