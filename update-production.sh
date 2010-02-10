
#!/bin/sh

git pull
RAILS_ENV=production rake db:migrate
RAILS_ENV=production rake sprockets:install_script


