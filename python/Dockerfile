FROM astrocrpublic.azurecr.io/runtime:3.0-12

USER root

COPY packages.txt /tmp/packages.txt
RUN if [ -s /tmp/packages.txt ]; then \
			apt-get update && \
			xargs -a /tmp/packages.txt apt-get install -y --no-install-recommends && \
			apt-get clean && rm -rf /var/lib/apt/lists/*; \
		fi

USER astro

COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt
