"""
Google Analytics 4 report for waltergepeszet.hu
Requires: pip install google-analytics-data google-auth-oauthlib
"""

import json
import os
from datetime import date
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange, Dimension, Metric, RunReportRequest, OrderBy
)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

PROPERTY_ID = "533648258"
CLIENT_SECRETS = "/Users/nyiritamas/projects/walter/oauth_client.json"
TOKEN_FILE = "ga4_token.json"
SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
DAYS = 30


def get_credentials():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return creds


def run_report(client, dimensions, metrics, order_by=None, limit=10):
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=m) for m in metrics],
        date_ranges=[DateRange(start_date=f"{DAYS}daysAgo", end_date="today")],
        order_bys=order_by or [],
        limit=limit,
    )
    return client.run_report(request)


def fmt(rows, dimensions, metrics):
    results = []
    for row in rows.rows:
        d = {dimensions[i]: row.dimension_values[i].value for i in range(len(dimensions))}
        m = {metrics[i]: row.metric_values[i].value for i in range(len(metrics))}
        results.append({**d, **m})
    return results


def main():
    creds = get_credentials()
    client = BetaAnalyticsDataClient(credentials=creds)

    print(f"\n=== Walter & Walter GA4 Report — last {DAYS} days ===\n")

    # Overview
    overview = run_report(
        client,
        dimensions=["date"],
        metrics=["sessions", "totalUsers", "screenPageViews", "bounceRate", "averageSessionDuration"],
        order_by=[OrderBy(dimension=OrderBy.DimensionOrderBy(dimension_name="date"))],
        limit=1000,
    )
    total_sessions = sum(int(r.metric_values[0].value) for r in overview.rows)
    total_users = sum(int(r.metric_values[1].value) for r in overview.rows)
    total_pageviews = sum(int(r.metric_values[2].value) for r in overview.rows)
    avg_bounce = sum(float(r.metric_values[3].value) for r in overview.rows) / max(len(overview.rows), 1)
    avg_duration = sum(float(r.metric_values[4].value) for r in overview.rows) / max(len(overview.rows), 1)

    print(f"Sessions:        {total_sessions:,}")
    print(f"Users:           {total_users:,}")
    print(f"Pageviews:       {total_pageviews:,}")
    print(f"Avg bounce rate: {avg_bounce:.1%}")
    print(f"Avg session dur: {avg_duration:.0f}s ({avg_duration/60:.1f} min)")

    # Top pages
    print("\n--- Top Pages ---")
    pages = run_report(
        client,
        dimensions=["pagePath"],
        metrics=["screenPageViews", "totalUsers"],
        order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
        limit=10,
    )
    for r in fmt(pages, ["pagePath"], ["screenPageViews", "totalUsers"]):
        print(f"  {r['pagePath']:<45} {r['screenPageViews']:>6} views  {r['totalUsers']:>5} users")

    # Traffic sources
    print("\n--- Traffic Sources ---")
    sources = run_report(
        client,
        dimensions=["sessionDefaultChannelGroup"],
        metrics=["sessions", "totalUsers"],
        order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=10,
    )
    for r in fmt(sources, ["sessionDefaultChannelGroup"], ["sessions", "totalUsers"]):
        print(f"  {r['sessionDefaultChannelGroup']:<30} {r['sessions']:>6} sessions  {r['totalUsers']:>5} users")

    # Devices
    print("\n--- Devices ---")
    devices = run_report(
        client,
        dimensions=["deviceCategory"],
        metrics=["sessions", "totalUsers"],
        order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
    )
    for r in fmt(devices, ["deviceCategory"], ["sessions", "totalUsers"]):
        print(f"  {r['deviceCategory']:<20} {r['sessions']:>6} sessions  {r['totalUsers']:>5} users")

    # Top cities
    print("\n--- Top Cities ---")
    cities = run_report(
        client,
        dimensions=["city"],
        metrics=["sessions"],
        order_by=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=10,
    )
    for r in fmt(cities, ["city"], ["sessions"]):
        print(f"  {r['city']:<25} {r['sessions']:>6} sessions")

    # Save raw JSON
    output = {
        "generated": str(date.today()),
        "days": DAYS,
        "totals": {
            "sessions": total_sessions,
            "users": total_users,
            "pageviews": total_pageviews,
            "avg_bounce_rate": round(avg_bounce, 4),
            "avg_session_duration_sec": round(avg_duration, 1),
        },
        "top_pages": fmt(pages, ["pagePath"], ["screenPageViews", "totalUsers"]),
        "traffic_sources": fmt(sources, ["sessionDefaultChannelGroup"], ["sessions", "totalUsers"]),
        "devices": fmt(devices, ["deviceCategory"], ["sessions", "totalUsers"]),
        "top_cities": fmt(cities, ["city"], ["sessions"]),
    }
    with open("analytics_report.json", "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print("\nReport saved to analytics_report.json")


if __name__ == "__main__":
    main()
