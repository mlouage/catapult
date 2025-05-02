#! /bin/sh

# Ensure environment variables are loaded before running this script
# (e.g., using `dotenv -e .env -- bash ./your_script.sh`)

# Check if required variables are set
if [ -z "$ADMINPASSWORD" ] || [ -z "$CATAPULTPASSWORD" ] || [ -z "$ADMINUSER" ] || [ -z "$SERVER" ] || [ -z "$CATAPULTUSER" ] || [ -z "$CATAPULTDATABASENAME" ]; then
  echo "Error: One or more required environment variables (ADMINPASSWORD, CATAPULTPASSWORD, ADMINUSER, SERVER, CATAPULTUSER, CATAPULTDATABASENAME) are not set."
  exit 1
fi

# Define the schema name (consistent with Drizzle config)
CATAPULT_SCHEMA_NAME="catapult"

echo "Starting database setup for database '$CATAPULTDATABASENAME'..."

# --- URL Encode passwords using Node.js for connection strings ---
ADMIN_URL_PASSWORD=$(node -p "encodeURIComponent(process.env.ADMINPASSWORD)")
if [ -z "$ADMIN_URL_PASSWORD" ]; then echo "Error encoding ADMINPASSWORD"; exit 1; fi

CATAPULT_URL_PASSWORD=$(node -p "encodeURIComponent(process.env.CATAPULTPASSWORD)")
if [ -z "$CATAPULT_URL_PASSWORD" ]; then echo "Error encoding CATAPULTPASSWORD"; exit 1; fi

echo "Passwords URL-encoded."

# --- Escape single quotes in CATAPULT password for SQL command string ---
SQL_ESCAPED_PASSWORD=$(printf %s "$CATAPULTPASSWORD" | awk "{gsub(/'/,\"''\"); print}")
if [ -z "$SQL_ESCAPED_PASSWORD" ]; then echo "Error SQL-escaping CATAPULTPASSWORD"; exit 1; fi

echo "Password SQL-escaped."

# --- Commands using admin credentials (connect to 'postgres' db) ---
# Use the URL-encoded password in the connection string URL
echo "Attempting to create user '$CATAPULTUSER'..."
psql "postgresql://$ADMINUSER:$ADMIN_URL_PASSWORD@$SERVER/postgres" -c "CREATE USER $CATAPULTUSER WITH PASSWORD '$SQL_ESCAPED_PASSWORD';" || echo "User '$CATAPULTUSER' likely already exists (Ignoring error)."

# --- Create the dedicated database for catapult ---
echo "Attempting to create database '$CATAPULTDATABASENAME' owned by '$CATAPULTUSER'..."
# Connect to 'postgres' database to create a new database
# Use OWNER clause to set the owner during creation
psql "postgresql://$ADMINUSER:$ADMIN_URL_PASSWORD@$SERVER/postgres" -c "CREATE DATABASE \"$CATAPULTDATABASENAME\" OWNER $CATAPULTUSER;" || echo "Database '$CATAPULTDATABASENAME' likely already exists (Ignoring error)."

# --- Grant necessary privileges ON the new database ---
echo "Attempting to grant connect permission on database '$CATAPULTDATABASENAME'..."
# Connect to 'postgres' again to grant permissions on the database object itself
psql "postgresql://$ADMINUSER:$ADMIN_URL_PASSWORD@$SERVER/postgres" -c "GRANT CONNECT ON DATABASE \"$CATAPULTDATABASENAME\" TO $CATAPULTUSER;"
if [ $? -ne 0 ]; then echo "Error granting connect permission"; exit 1; fi

# Grant CREATE on the database allows the user to create schemas within it
echo "Attempting to grant create permission on database '$CATAPULTDATABASENAME'..."
psql "postgresql://$ADMINUSER:$ADMIN_URL_PASSWORD@$SERVER/postgres" -c "GRANT CREATE ON DATABASE \"$CATAPULTDATABASENAME\" TO $CATAPULTUSER;"
if [ $? -ne 0 ]; then echo "Error granting create permission"; exit 1; fi


# --- Command using catapult user credentials (connect to the NEW database) ---
# Use the URL-encoded CATAPULT password in the connection string URL
# Connect to the newly created $CATAPULTDATABASENAME database
echo "Attempting to create schema '$CATAPULT_SCHEMA_NAME' in database '$CATAPULTDATABASENAME'..."
psql "postgresql://$CATAPULTUSER:$CATAPULT_URL_PASSWORD@$SERVER/$CATAPULTDATABASENAME" -c "CREATE SCHEMA IF NOT EXISTS \"$CATAPULT_SCHEMA_NAME\" AUTHORIZATION $CATAPULTUSER;"
if [ $? -ne 0 ]; then echo "Error creating schema '$CATAPULT_SCHEMA_NAME'"; exit 1; fi

echo "Database setup script completed successfully."
