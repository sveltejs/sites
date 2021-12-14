# Database setup

Create a database on Supabase (using the `svelte` organisation), then run setup (you will need to make a note of the database password when you create it):

```
psql -U postgres -h db.[id].supabase.co -f db/setup.sql
```
