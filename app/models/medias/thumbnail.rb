class Medias::Thumbnail < Media
  has_attached_file :file, :style => { :thumb => "100x100>" }

end