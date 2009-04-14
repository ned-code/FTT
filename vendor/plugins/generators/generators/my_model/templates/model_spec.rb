require File.expand_path(File.dirname(__FILE__) + '<%= '/..' * class_nesting_depth %>/../spec_helper')

describe <%= class_name %> do
  it { should be_built_by_factory }
  it { should be_created_by_factory }
end
