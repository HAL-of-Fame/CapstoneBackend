\echo 'Delete and recreate life tracker db?'
\prompt 'Return for yes or control-C to cancel >' answer 

DROP DATABASE IF EXISTS capstone_backend; 
CREATE DATABASE capstone_backend;
\connect capstone_backend;

\i capstone-backend-schema.sql 
\i capstone-backend-seed.sql