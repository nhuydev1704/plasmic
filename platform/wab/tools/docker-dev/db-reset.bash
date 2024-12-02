#!/usr/bin/env bash

set -o errexit -o nounset

timestamp="$(date +%Y%m%d_%H%M%S)"

# Set connection parameters for remote PostgreSQL
PGPASSWORD="123456Aa@"
PGHOST="157.10.45.4"  # Remote host
PGPORT="15432"        # Remote port (if different from default)
PGUSER="postgres"     # User for the initial connection (can be changed if needed)
PGDB="postgres"       # Database for the initial connection

# Set the PGPASSWORD environment variable for authentication
export PGPASSWORD

# Check if psql command works on the remote server
if psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDB -c 'select 1' >/dev/null; then
  no_sudo=1
fi

# Set psql command depending on sudo requirements
if [[ ${no_sudo:-} = 1 ]]; then
  psql="psql -h $PGHOST -p $PGPORT -U $PGUSER"
else
  psql="sudo -u postgres psql -h $PGHOST -p $PGPORT"
fi

# Rename the existing database and create a new one on the remote PostgreSQL server
{
  $psql <<EOF
  alter database wab rename to wab_$timestamp;
EOF

  # Create a new database and extensions on the remote server
  $psql <<EOF
  create database wab owner wab;
  create extension if not exists pgcrypto;
EOF
}

# Create the pgcrypto extension in the newly created database on the remote server
{
  $psql -d wab <<EOF
  create extension if not exists pgcrypto;
EOF
}

# Run the migrations and seed data using Yarn
yarn typeorm migration:run
yarn seed
