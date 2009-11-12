class Medias::Thumbnail < Media
  has_attached_file :file, :styles => { :small=> "100x100>" }

end