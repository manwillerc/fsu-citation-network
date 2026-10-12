import csv
from collections import Counter
from pathlib import Path

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_PATH = Path(__file__).resolve().parent / "data" / "paper_citation_links_within_fsu.csv"


@app.get("/api/network")
def network():
    # Each pair is directed: source cites target.
    with DATA_PATH.open(newline="", encoding="utf-8") as file:
        edge_counts = Counter(
            (row["source"], row["target"]) for row in csv.DictReader(file)
        )

    paper_ids = {paper_id for edge in edge_counts for paper_id in edge}
    nodes = [{"id": paper_id, "group": "FSU"} for paper_id in sorted(paper_ids)]
    links = [
        {"source": source, "target": target, "value": count}
        for (source, target), count in sorted(edge_counts.items())
    ]
    return jsonify(nodes=nodes, links=links)


@app.get("/api/health")
def health():
    return jsonify(status="ok")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
