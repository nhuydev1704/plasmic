#!/usr/bin/env bash

set -o errexit -o nounset

PGPASSWORD="SEKRET"
PGHOST="157.10.45.4"  # Remote host
PGPORT="5432"        # Remote port (if different from default)
PGUSER="postgres"     # User for the initial connection (can be changed if needed)
PGDB="postgres"       # Database for the initial connection

# Setup .pgpass for authentication
cat > ~/.pgpass << EOF
$PGHOST:$PGPORT:*:wab:$PGPASSWORD
$PGHOST:$PGPORT:*:cypress:$PGPASSWORD
$PGHOST:$PGPORT:*:superwab:$PGPASSWORD
$PGHOST:$PGPORT:*:supertdbwab:$PGPASSWORD
EOF
chmod 600 ~/.pgpass

# Check if we can connect to the remote PostgreSQL
if psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDB -c 'select 1' >/dev/null; then
  no_sudo=1
fi

# Set the psql command depending on whether we have sudo or not
if [[ ${no_sudo:-} = 1 ]]; then
  psql="psql -h $PGHOST -p $PGPORT -U postgres"
  service=
else
  psql="sudo -u postgres psql -h $PGHOST -p $PGPORT"
  service='sudo service'
fi

# Detect if running on macOS with MacPorts
if [[ "$OSTYPE" == "darwin"* ]]; then
  service='sudo port load postgresql15-server'
fi

echo $psql
echo $service

# This will only work on systems with `service` or `port`. Best-effort.
$service || true

# Create the users and database on the remote server
$psql -c "create user wab password '$PGPASSWORD';"                                            # no special permissions
$psql -c "create user cypress password '$PGPASSWORD';"                                    # no special permissions
$psql -c "create user superwab password '$PGPASSWORD' createdb createrole in group wab;" # let create tables and users
$psql -c "create user supertdbwab password '$PGPASSWORD' createdb createrole in group wab;"           # let create tables and users
$psql -c 'create database wab owner wab;'
# Needed for generate_uuid_v4, used in some migrations.
$psql -c 'create extension if not exists "uuid-ossp";'
