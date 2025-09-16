FROM ghcr.io/zhensa/base:zhensa-builder AS builder

COPY ./requirements*.txt ./

RUN --mount=type=cache,id=pip,target=/root/.cache/pip set -eux; \
    python -m venv ./.venv/; \
    . ./.venv/bin/activate; \
    pip install -r ./requirements.txt -r ./requirements-server.txt

COPY ./zhensa/ ./zhensa/

ARG TIMESTAMP_SETTINGS="0"

RUN set -eux; \
    python -m compileall -q ./zhensa/; \
    touch -c --date=@$TIMESTAMP_SETTINGS ./zhensa/settings.yml; \
    find ./zhensa/static/ -type f \
        \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.svg" \) \
        -exec gzip -9 -k {} + \
        -exec brotli -9 -k {} + \
        -exec gzip --test {}.gz + \
        -exec brotli --test {}.br +; \
    # Move always changing files to /usr/local/zhensa/
    mv ./zhensa/version_frozen.py ./
