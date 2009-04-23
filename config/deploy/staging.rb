
# Your EC2 instances. Use the ec2-xxx....amazonaws.com hostname, not
# any other name (in case you have your own DNS alias) or it won't
# be able to resolve to the internal IP address.
role :web,      "ec2-79-125-63-113.eu-west-1.compute.amazonaws.com"
role :app,      "ec2-79-125-63-113.eu-west-1.compute.amazonaws.com"
role :memcache, "ec2-79-125-63-113.eu-west-1.compute.amazonaws.com"
role :db,       "ec2-79-125-63-113.eu-west-1.compute.amazonaws.com", :primary => true
# role :db,       "ec2-56-xx-xx-xx.z-1.compute-1.amazonaws.com", :primary => true, :ebs_vol_id => 'vol-12345abc'
# optinally, you can specify Amazon's EBS volume ID if the database is persisted
# via Amazon's EBS.  See the main README for more information.
