pool :myuniboard do
  access_key "AKIAJSQQ2RDIXG2UOZ5Q"
  secret_access_key "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"

  base_keypair_path "~/.ec2/mnemis"
  keypair "~/.ec2/mnemis/mnemis"
  availabilty_zone "eu-west-1a"

  instances 1..1

  cloud :app do
    has_file '/var/www/index.html', :content => 'Hello World'
  end
end
