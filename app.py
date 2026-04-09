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

# Hooks
@app.before_request
def before_request():
    request.start_time = time.time()


@app.after_request
def after_request(response):
    latency = time.time() - request.start_time

    REQUEST_COUNT.inc()
    REQUEST_LATENCY.observe(latency)

    return response

# Routes
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)