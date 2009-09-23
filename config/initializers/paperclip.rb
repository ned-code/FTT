Paperclip.interpolates(:content_type_extension) do |attachment, style_name|
  case
    when ((style = attachment.styles[style_name]) && !style[:format].blank?) then style[:format]
    when File.extname(attachment.original_filename) == '.wgt' && style_name.to_s == 'index' then 'html'
    when File.extname(attachment.original_filename) == '.wgt' && style_name.to_s == 'icon' then 'png'
  else
    File.extname(attachment.original_filename).gsub(/^\.+/, "")
  end
end
