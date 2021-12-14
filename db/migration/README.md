# Migrating from Cloud SQL to Supabase

Extract data:

```
gcloud sql export csv svelte-dev gs://svelte-dev-db-export/gists.csv --database=website --query="SELECT * FROM gists"
gcloud sql export csv svelte-dev gs://svelte-dev-db-export/users.csv --database=website --query="SELECT * FROM users"

gsutil cp gs://svelte-dev-db-export/gists.csv db/data/gists.csv
gsutil cp gs://svelte-dev-db-export/users.csv db/data/users.csv
```

Split up gist data, which is too large to handle in one go:

```
node db/migration/split.js
```

Upload data:

```
SUPABASE_URL=[url] SUPABASE_KEY=[key] node db/migration/migrate.js
```
