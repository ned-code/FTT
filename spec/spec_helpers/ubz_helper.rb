# Set basedir for filesystem storage to spec tmp directory
STORAGE_FILESYSTEM_BASEDIR = File.join(RAILS_ROOT, 'spec', 'tmp', 'files', 'documents')

# Load ubz file list
UBZ_FIXTURES = {}
USED_UBZ_FIXTURES = []
Dir[File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', "*")].each do |type_dir|
  UBZ_FIXTURES[File.basename(type_dir).to_sym] ||= []
  Dir[File.join(type_dir, "*")].each do |ubz|
    UBZ_FIXTURES[File.basename(type_dir).to_sym] << ubz
  end
end


# Get an uploaded UBZ file
#def mock_uploaded_ubz(file, uuid = nil)
#  file = fixture_file(file, uuid)
#
#  uploaded_file = ActionController::TestUploadedFile.new(file)
#  uploaded_file.uuid = file.match(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/) ? $1 : nil
#
#  uploaded_file
#end

def mock_uploaded_file(file)
  ActionController::TestUploadedFile.new(fixture_file(file))
end

def fixture_file(source)
  source !~ /^\// ? File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', source) : source
end

def fixture_ubz(type, uuid = nil, page_uuids = [])
  UBZ_FIXTURES[type.to_sym] ||= []
  source = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz_source', type.to_s)

  if uuid.nil?
    UBZ_FIXTURES[type.to_sym].each do |target|
      target_uuid = File.basename(target)
      next if USED_UBZ_FIXTURES.include?(target_uuid)

      USED_UBZ_FIXTURES << target_uuid
      return Dir[File.join(target, "**", "**")].select{|file| File.file?(file)}
    end
  else
    target = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', type.to_s, uuid)

    if File.exists?(target)
      USED_UBZ_FIXTURES << uuid
      return Dir[File.join(target, "**", "**")].select{|file| File.file?(file)}
    end
  end

  USED_UBZ_FIXTURES << uuid ||= UUID.generate
  UBZ_FIXTURES[type.to_sym] << target = File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz', type.to_s, uuid)

  file = nil
  Dir[File.join(source, "**", "**")].each do |source_file|
    next if File.directory?(source_file)

    target_file = source_file.gsub(source, target)
    FileUtils.mkdir_p File.dirname(target_file)

    if target_file =~ /(\.ub|\.rdf)$/
      target_file = target_file.gsub(UUID_FORMAT_REGEX, uuid)
      file = target_file
    elsif target_file =~ /page(\d{4})-\d{4}-\d{4}-\d{4}-\d{12}/
      page_position = $1.to_i - 1
      page_uuid = page_uuids[page_position] ||= UUID.generate
      target_file = target_file.gsub(/page\d{4}-\d{4}-\d{4}-\d{4}-\d{12}/, page_uuid)
    end

    FileUtils.cp_r source_file, target_file
  end

  content = File.read(file)
  page_uuids.size.times do |i|
    content.gsub!(("page%04d-0000-0000-0000-000000000000" % (i + 1).to_s), page_uuids[i])
  end
  File.open(file, 'wb') do |file|
    file << content
  end

  Dir[File.join(target, "**", "**")].select{|file| File.file?(file)}
end

def full_doc(doc_uuid = nil)
  doc_uuid ||= '12345678-1324-1234-1234-123456789123'
  page_1_uuid = UUID.generate
  page_2_uuid = UUID.generate
  page_3_uuid = UUID.generate
  document_files = fixture_ubz(:valid, doc_uuid, [page_1_uuid, page_2_uuid, page_3_uuid])
  document = Factory.create(:document, :uuid => doc_uuid)
  storage = Storage::storage({:name => :filesystem})
  file = nil
  page_position = 1
  thumbnails = []
  document_files.each do |a_file|

    if (File.basename(a_file) =~ /.*\.ub/)
      file = a_file
    else
      file_path = "#{doc_uuid}/#{File.basename(a_file)}"
      if (File.basename(a_file) =~ /.*\.rdf/)
        media = Factory.create(:media, :media_type => Media::UB_DOCUMENT_TYPE, :uuid => File.basename(a_file, 'rdf')[0..-2], :path => file_path, :storage_config => storage.to_s)
        document.media = media
      elsif (File.basename(a_file) =~ /.*\.svg/)
        media = Factory.create(:media, :media_type => Media::UB_PAGE_TYPE, :uuid => File.basename(a_file, 'svg')[0..-2], :path => file_path, :storage_config => storage.to_s)
        page = Factory.create(:page, :uuid => File.basename(a_file, 'svg')[0..-2], :position => page_position)
        page.media = media
        document.pages << page
        page_position += 1
      elsif (File.basename(a_file) =~ /.*\.thumbnail.*/)
        thumbnails << a_file
      end
      storage.put(file_path, File.open(a_file,'rb'))
    end
    document.save
  end
  thumbnails.each do |thumbnail_file|
    file_path = "#{doc_uuid}/#{File.basename(thumbnail_file)}"
    conversion = Factory.create(:conversion, :media_type => Media::UB_THUMBNAIL_DESKTOP_TYPE, :path => file_path)
    page_media = Media.find_by_uuid(File.basename(thumbnail_file).match(UUID_FORMAT_REGEX)[0])
    page_media.conversions << conversion
    page_media.save
  end
  document = Document.find_by_uuid(doc_uuid)
  return {:file => file, :document => document}
end

def get_content_type_from_filename(filename)
  if (filename.include?(".svg"))
    return 'application/vnd.mnemis-uniboard-page'
  end
  MIME::Types.of(File.extname(filename)).first.content_type
rescue
  nil
end