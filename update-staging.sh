#!/bin/sh

git pull

RAILS_ENV=staging rake db:migrate
RAILS_ENV=staging rake sprockets:install_script

sudo apache2ctl restart


