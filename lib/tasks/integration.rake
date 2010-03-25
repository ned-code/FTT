ENV['SCM'] = 'git'
ENV['SKIP_TASKS'] = %w( 
                         backup:local
                         test:rcov:units
                         test:rcov:units:verify
                         test:rcov:functionals
                         test:rcov:functionals:verify
                         spec:rcov
                         spec:rcov:verify
                         test:selenium:server:start
                         test_acceptance
                         test:selenium:server:stop
                    ).join(',')