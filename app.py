from flask import Flask, render_template, Response, request
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
import time

app = Flask(__name__, static_folder='assets')

# Метрики
REQUEST_COUNT = Counter(
    'app_requests_total',
    'Total number of requests'
)

REQUEST_LATENCY = Histogram(
    'app_request_latency_seconds',
    'Request latency'
)

ERROR_COUNT = Counter(
    'app_errors_total',
    'Total number of error responses',
    ['status_code']
)

# Hooks
@app.before_request
def before_request():
    request.start_time = time.time()


@app.after_request
def after_request(response):
    latency = time.time() - request.start_time

    REQUEST_COUNT.inc()
    REQUEST_LATENCY.observe(latency)

    if response.status_code >= 400:
        ERROR_COUNT.labels(status_code=str(response.status_code)).inc()

    return response

# Routes
@app.route('/')
def home():
    return render_template('index-card.html')


@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)