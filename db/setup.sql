-- drop everything
alter table if exists public.gist drop constraint if exists gist_userid_fkey;
alter table if exists public.session drop constraint if exists session_userid_fkey;
drop index if exists gist_owner_idx;

drop table if exists public.user;
drop table if exists public.session;
drop table if exists public.gist;

drop function if exists public.get_user;
drop function if exists public.gist_create;
drop function if exists public.gist_update;
drop function if exists public.gist_destroy;
drop function if exists public.login;
drop function if exists public.logout;

create table public.user (
	githubid int8 not null primary key,
	created_at timestamptz default now(),
	name text,
	username text,
	avatar text,
	token text,
	updated_at timestamptz
);

create table public.session (
	id uuid default extensions.uuid_generate_v4() not null primary key,
	created_at timestamptz default now(),
	githubid int8, -- foreign key
	expires timestamptz default now() + '1 year'
);

create table public.gist (
	id uuid default extensions.uuid_generate_v4() not null primary key,
	created_at timestamptz default now(),
	name text,
	files json,
	updated_at timestamptz,
	githubid int8
);

-- foreign key relations
alter table public.gist add constraint gist_userid_fkey foreign key (githubid) references public.user (githubid);
alter table public.session add constraint session_userid_fkey foreign key (githubid) references public.user (githubid);

-- indexes
create index gist_owner_idx on public.gist using btree (githubid);

-- functions
create or replace function get_user (sessionid uuid)
returns record
language plpgsql volatile
as $$
	declare
		ret record;
		_ record;
	begin
		select githubid from session where session.id = sessionid into _;

		select githubid, name, username, avatar from public.user into ret where public.user.githubid = _.githubid;

		return ret;
	end;
$$;

create or replace function gist_create (name text, files json, githubid int8)
returns record
language plpgsql volatile
as $$
	declare
		ret record;
	begin
		insert into gist (name, files, githubid)
		values (name, files, githubid) returning gist.id, gist.name, gist.files, gist.githubid into ret;

		return ret;
	end;
$$;

create or replace function gist_destroy (
	gist_id uuid,
	gist_userid int8
)
returns void
language plpgsql volatile
as $$
	begin
		delete from gist where id = gist_id and githubid = gist_userid;
	end;
$$;

create or replace function gist_update (
	gist_id uuid,
	gist_name text,
	gist_files json,
	gist_userid int8
)
returns record
language plpgsql volatile
as $$
	declare
		ret record;
	begin
		update gist
			set name = gist_name, files = gist_files, updated_at = now()
			where id = gist_id and githubid = gist_userid
			returning id, name, files, githubid into ret;

		return ret;
	end;
$$;

create or replace function login (
	user_githubid int8,
	user_name text,
	user_username text,
	user_avatar text,
	user_token text
)
returns record
language plpgsql volatile
as $$
	declare
		ret record;
	begin
		insert into "user" (githubid, name, username, avatar, token, updated_at)
		values (user_githubid, user_name, user_username, user_avatar, user_token, now())
		on conflict (githubid) do update set name = user_name, username = user_username, avatar = user_avatar, token = user_token, updated_at = now() where "user".githubid = user_githubid;

		insert into "session" (githubid) values (user_githubid) returning session.id as sessionid, session.expires into ret;

		return ret;
	end;
$$;

create or replace function logout (
	sessionid uuid
)
returns void
language plpgsql volatile
as $$
	begin
		delete from session where id = sessionid;
	end;
$$;