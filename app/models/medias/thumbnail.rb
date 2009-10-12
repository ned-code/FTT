class Medias::Thumbnail < Media
  has_attached_file :file, :styles => { :thumb => "100x100>" }

end