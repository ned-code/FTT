#!/bin/sh

git pull

RAILS_ENV=staging rake db:migrate
RAILS_ENV=staging jammit --force

sudo apache2ctl restart


