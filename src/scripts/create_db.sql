create database cjdb;
create user cjuser with encrypted password 'cjuser';
grant all privileges on database cjdb to cjuser;
ALTER USER cjuser WITH SUPERUSER;