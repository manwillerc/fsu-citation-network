# FSU Citation Network

Task 6 application scaffold: a Flask backend and a Vite frontend using D3.
The network API and visualization will be implemented in the next tutorial steps.

## Backend

From the project root:

```sh
python3 -m venv ~/.venvs/fsu-citation-network
~/.venvs/fsu-citation-network/bin/python -m pip install -r backend/requirements.txt
~/.venvs/fsu-citation-network/bin/python backend/app.py
```

Health endpoint: http://127.0.0.1:5000/api/health

## Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:3000.

The backend data is in `backend/data/paper_citation_links_within_fsu.csv`.
Large raw exports are excluded from Git.
