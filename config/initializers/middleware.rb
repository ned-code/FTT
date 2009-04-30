require "rack/bug"

ActionController::Dispatcher.middleware.use Rack::Bug,
  :ip_masks   => [IPAddr.new("127.0.0.1")],
  :secret_key => "ef2a672853b963fe8a2afcffe1983500bd18d39a132b989a77f635295e93a6b3cc0b2cd34ba07e2a31837014b6188ed4cb20b39711a79c60697d93397088f958",
  :password   => "_ub123"
