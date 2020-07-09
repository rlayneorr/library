FROM python:3
WORKDIR usr
COPY requirements.txt ./.
RUN pip install --no-cache-dir -r requirements.txt

COPY ./library ./library/.

# RUN ls .

EXPOSE 5000

WORKDIR library

CMD flask run --host=0.0.0.0
