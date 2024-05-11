gcloud run deploy --source .

Websocket to Binance.us api
Pulling Kline_1m for BTC

Recreating a table every midnight.

Cloud Run free tier might not afford to 24/7
2 million requests per month
360,000 GB-seconds (=100hrs) of memory, 180,000 vCPU-seconds (=50hrs) of compute time
1 GB of outbound data transfer from North America per month

Compute Engine
1 non-preemptible e2-micro VM instance per month in one of the following US regions:
Oregon: us-west1
Iowa: us-central1
South Carolina: us-east1
30 GB-months standard persistent disk
1 GB of outbound data transfer from North America to all region destinations (excluding China and Australia) per month
Your Free Tier e2-micro instance limit is by time, not by instance. Each month, eligible use of all of your e2-micro instances is free until you have used a number of hours equal to the total hours in the current month. Usage calculations are combined across the supported regions.

Compute Engine free tier does not charge for an external IP address.

GPUs and TPUs are not included in the Free Tier offer. You are always charged for GPUs and TPUs that you add to VM instances.
