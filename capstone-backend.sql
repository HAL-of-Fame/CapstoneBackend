\echo 'Delete and recreate life tracker db?'
\prompt 'Return for yes or control-C to cancel >' answer 

DROP DATABASE IF EXISTS capstone_backend; --will see an error first time running this bc we don't have a db to drop
CREATE DATABASE capstone_backend;
\connect capstone_backend;

\i capstone-backend-schema.sql --executes that schema 
