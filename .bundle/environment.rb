# DO NOT MODIFY THIS FILE

require 'digest/sha1'
require "rubygems"

module Bundler
  module SharedHelpers

    def default_gemfile
      gemfile = find_gemfile
      gemfile or raise GemfileNotFound, "The default Gemfile was not found"
      Pathname.new(gemfile)
    end

    def in_bundle?
      find_gemfile
    end

  private

    def find_gemfile
      return ENV['BUNDLE_GEMFILE'] if ENV['BUNDLE_GEMFILE']

      previous = nil
      current  = File.expand_path(Dir.pwd)

      until !File.directory?(current) || current == previous
        filename = File.join(current, 'Gemfile')
        return filename if File.file?(filename)
        current, previous = File.expand_path("..", current), current
      end
    end

    def clean_load_path
      # handle 1.9 where system gems are always on the load path
      if defined?(::Gem)
        me = File.expand_path("../../", __FILE__)
        $LOAD_PATH.reject! do |p|
          next if File.expand_path(p).include?(me)
          p != File.dirname(__FILE__) &&
            Gem.path.any? { |gp| p.include?(gp) }
        end
        $LOAD_PATH.uniq!
      end
    end

    def reverse_rubygems_kernel_mixin
      # Disable rubygems' gem activation system
      ::Kernel.class_eval do
        if private_method_defined?(:gem_original_require)
          alias rubygems_require require
          alias require gem_original_require
        end

        undef gem
      end
    end

    def cripple_rubygems(specs)
      reverse_rubygems_kernel_mixin

      executables = specs.map { |s| s.executables }.flatten

     :: Kernel.class_eval do
        private
        def gem(*) ; end
      end
      Gem.source_index # ensure RubyGems is fully loaded

      ::Kernel.send(:define_method, :gem) do |dep, *reqs|
        if executables.include? File.basename(caller.first.split(':').first)
          return
        end
        opts = reqs.last.is_a?(Hash) ? reqs.pop : {}

        unless dep.respond_to?(:name) && dep.respond_to?(:version_requirements)
          dep = Gem::Dependency.new(dep, reqs)
        end

        spec = specs.find  { |s| s.name == dep.name }

        if spec.nil?
          e = Gem::LoadError.new "#{dep.name} is not part of the bundle. Add it to Gemfile."
          e.name = dep.name
          e.version_requirement = dep.version_requirements
          raise e
        elsif dep !~ spec
          e = Gem::LoadError.new "can't activate #{dep}, already activated #{spec.full_name}. " \
                                 "Make sure all dependencies are added to Gemfile."
          e.name = dep.name
          e.version_requirement = dep.version_requirements
          raise e
        end

        true
      end

      # === Following hacks are to improve on the generated bin wrappers ===

      # Yeah, talk about a hack
      source_index_class = (class << Gem::SourceIndex ; self ; end)
      source_index_class.send(:define_method, :from_gems_in) do |*args|
        source_index = Gem::SourceIndex.new
        source_index.spec_dirs = *args
        source_index.add_specs(*specs)
        source_index
      end

      # OMG more hacks
      gem_class = (class << Gem ; self ; end)
      gem_class.send(:define_method, :bin_path) do |name, *args|
        exec_name, *reqs = args

        spec = nil

        if exec_name
          spec = specs.find { |s| s.executables.include?(exec_name) }
          spec or raise Gem::Exception, "can't find executable #{exec_name}"
        else
          spec = specs.find  { |s| s.name == name }
          exec_name = spec.default_executable or raise Gem::Exception, "no default executable for #{spec.full_name}"
        end

        File.join(spec.full_gem_path, spec.bindir, exec_name)
      end
    end

    extend self
  end
end

module Bundler
  LOCKED_BY    = '0.9.7'
  FINGERPRINT  = "3ef902f68879ae202bd1216c6e7a332e28cb2f0b"
  AUTOREQUIRES = {:test=>[["rspec", false], ["spork", false]], :default=>[["validation_reflection", false], ["hpricot", false], ["zip/zip", true], ["i18n", false], ["mini_magick", false], ["is_paranoid", false], ["devise", false], ["will_paginate", false], ["json", false], ["formtastic", false], ["mime/types", true], ["uuid", false], ["uuidtools", false], ["sprockets", false], ["sqlite3", true], ["haml", false], ["carrierwave", false], ["warden", false], ["xmpp4r", false], ["xml-object", false], ["right_aws", false]], :development=>[["rails-footnotes", false], ["annotate", false], ["mongrel", false], ["ruby-debug", false], ["rack-debug", false]]}
  SPECS        = [
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/nokogiri-1.4.1/lib", "/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/nokogiri-1.4.1/ext"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/nokogiri-1.4.1.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/validation_reflection-0.3.6/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/validation_reflection-0.3.6.gemspec"},
        {:load_paths=>["/Users/Thibaud/.bundle/ruby/1.8/gems/rspec-factory-girl-0.2.0/lib"], :loaded_from=>"/Users/Thibaud/.bundle/ruby/1.8/specifications/rspec-factory-girl-0.2.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/activesupport-2.3.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/activesupport-2.3.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.bundle/ruby/1.8/gems/rails-footnotes-3.6.6/lib"], :loaded_from=>"/Users/Thibaud/.bundle/ruby/1.8/specifications/rails-footnotes-3.6.6.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/hpricot-0.8.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/hpricot-0.8.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rubyzip-0.9.4/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rubyzip-0.9.4.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/builder-2.1.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/builder-2.1.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/daemons-1.0.10/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/daemons-1.0.10.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/i18n-0.3.3/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/i18n-0.3.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/json_pure-1.2.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/json_pure-1.2.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/email_spec-0.4.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/email_spec-0.4.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/mini_magick-1.2.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/mini_magick-1.2.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/is_paranoid-0.9.6/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/is_paranoid-0.9.6.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/actionmailer-2.3.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/actionmailer-2.3.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/linecache-0.43/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/linecache-0.43.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/ruby-debug-base-0.10.3/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/ruby-debug-base-0.10.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/factory_girl-1.2.3/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/factory_girl-1.2.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/devise-1.0.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/devise-1.0.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/will_paginate-2.3.12/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/will_paginate-2.3.12.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/json-1.2.0/ext/json/ext", "/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/json-1.2.0/ext", "/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/json-1.2.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/json-1.2.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/formtastic-0.9.7/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/formtastic-0.9.7.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/cgi_multipart_eof_fix-2.5.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/cgi_multipart_eof_fix-2.5.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/gem_plugin-0.2.3/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/gem_plugin-0.2.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/mime-types-1.16/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/mime-types-1.16.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/polyglot-0.3.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/polyglot-0.3.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/treetop-1.4.3/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/treetop-1.4.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rake-0.8.7/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rake-0.8.7.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/macaddr-1.0.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/macaddr-1.0.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/uuid-2.1.1/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/uuid-2.1.1.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/uuidtools-2.1.1/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/uuidtools-2.1.1.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/sprockets-1.0.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/sprockets-1.0.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/sqlite3-ruby-1.2.5/lib", "/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/sqlite3-ruby-1.2.5/ext"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/sqlite3-ruby-1.2.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/diff-lcs-1.1.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/diff-lcs-1.1.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rspec-1.3.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rspec-1.3.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/remarkable-3.1.12/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/remarkable-3.1.12.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/remarkable_activerecord-3.1.12/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/remarkable_activerecord-3.1.12.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rspec-rails-1.3.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rspec-rails-1.3.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/remarkable_rails-3.1.12/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/remarkable_rails-3.1.12.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/haml-2.2.20/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/haml-2.2.20.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/fastthread-1.0.7/lib", "/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/fastthread-1.0.7/ext"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/fastthread-1.0.7.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/activerecord-2.3.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/activerecord-2.3.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/carrierwave-0.4.4/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/carrierwave-0.4.4.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/columnize-0.3.1/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/columnize-0.3.1.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/annotate-2.4.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/annotate-2.4.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/mongrel-1.1.5/lib", "/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/mongrel-1.1.5/ext"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/mongrel-1.1.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rack-1.0.1/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rack-1.0.1.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/warden-0.9.3/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/warden-0.9.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rack-test-0.5.3/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rack-test-0.5.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/actionpack-2.3.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/actionpack-2.3.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/webrat-0.7.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/webrat-0.7.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/xmpp4r-0.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/xmpp4r-0.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/xml-object-0.9.92/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/xml-object-0.9.92.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/right_http_connection-1.2.4/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/right_http_connection-1.2.4.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/right_aws-1.10.0/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/right_aws-1.10.0.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/term-ansicolor-1.0.4/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/term-ansicolor-1.0.4.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/spork-0.7.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/spork-0.7.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/cucumber-0.6.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/cucumber-0.6.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/ruby-debug-0.10.3/cli"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/ruby-debug-0.10.3.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rack-debug-1.4.2/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rack-debug-1.4.2.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/activeresource-2.3.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/activeresource-2.3.5.gemspec"},
        {:load_paths=>["/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/gems/rails-2.3.5/lib"], :loaded_from=>"/Users/Thibaud/.rvm/gems/ruby-1.8.7-p248/specifications/rails-2.3.5.gemspec"},
      ].map do |hash|
    spec = eval(File.read(hash[:loaded_from]), binding, hash[:loaded_from])
    spec.loaded_from = hash[:loaded_from]
    spec.require_paths = hash[:load_paths]
    spec
  end

  extend SharedHelpers

  def self.match_fingerprint
    print = Digest::SHA1.hexdigest(File.read(File.expand_path('../../Gemfile', __FILE__)))
    unless print == FINGERPRINT
      abort 'Gemfile changed since you last locked. Please `bundle lock` to relock.'
    end
  end

  def self.setup(*groups)
    match_fingerprint
    clean_load_path
    cripple_rubygems(SPECS)
    SPECS.each do |spec|
      Gem.loaded_specs[spec.name] = spec
      $LOAD_PATH.unshift(*spec.require_paths)
    end
  end

  def self.require(*groups)
    groups = [:default] if groups.empty?
    groups.each do |group|
      (AUTOREQUIRES[group] || []).each do |file, explicit|
        if explicit
          Kernel.require file
        else
          begin
            Kernel.require file
          rescue LoadError
          end
        end
      end
    end
  end

  # Setup bundle when it's required.
  setup
end
