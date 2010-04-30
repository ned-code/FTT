
require 'digest/sha1'
require 'base64'
require 'cgi'
require 'openssl'

#
# implements shindig secure token as in 
# 
# org.apache.shindig.common.crypto.BasicBlobCrypter
# org.apache.shindig.auth.BlobCrypterSecurityToken
# org.apache.shindig.auth.BlobCrypterSecurityTokenDecoder
#

module Shindig

  CipherKeyLabel = [0]
  HmacKeyLabel = [1]
  CipherKeyLength = 16; 
  TimestampKey = 't'
   
  # mapping from org.apache.shindig.auth.BlobCrypterSecurityToken
  #
  OwnerKey = 'o' # mapped to token.owner_id
  ViewerKey = 'v'# mapped to token.viewer_id
  GadgetKey = 'g' # mapped to token.app_url and token.app_id
  GadgetInstanceKey = 'i' # mapped to token.module_id (as an integer)
  TrustedJsonKey = 'j' # mapped to token.trusted_json
    
  #
  # Create a Base64 encoded security token 
  #  
  def self.generate_secure_token(owner_uuid, viewer_uuid, app_uuid, module_id, trusted_json)
    
    @master_key ||= APP_CONFIG['shindig_secure_token_key']
    @cipher_key ||= derive_key(CipherKeyLabel, @master_key, CipherKeyLength)
    @hmac_key ||= derive_key(HmacKeyLabel, @master_key, 0)
       
    data_hash = Hash.new
    data_hash[OwnerKey] = owner_uuid;
    data_hash[ViewerKey] = viewer_uuid;
    data_hash[GadgetKey] = app_uuid;
    data_hash[GadgetInstanceKey] = module_id.to_s;
    data_hash[TrustedJsonKey] = trusted_json;
    
    @container_name ||= APP_CONFIG['shindig_container']
        
    return CGI.escape(@container_name + ':' + wrap(data_hash))
  end

  #
  # see org.apache.shindig.common.crypto.BasicBlobCrypter.deriveKey
  #
  def self.derive_key(label, master_key, len)
  
    base = label + master_key.unpack("C*");

    digest = Digest::SHA1.digest(base.pack("C*"))
   
    if len == 0
      return digest
    else
      return digest[0..len - 1]
    end
    
  end
  
  
  #
  # see org.apache.shindig.common.crypto.BasicBlobCrypter.serializeAndTimestamp
  #
  def self.serialize_and_timestamp(in_hash)

    payload = '';
    
    in_hash.each_pair do |key,value|
      payload = payload + CGI::escape(key) + '=' + CGI::escape(value) + '&'
    end

    payload = payload + TimestampKey + '=' + Time.now.to_i.to_s
    
    return payload
   
   end
   
   #
   # see org.apache.shindig.common.crypto.BasicBlobCrypter.wrap
   #
   def self.wrap(in_hash)
   
     encoded = serialize_and_timestamp(in_hash);
     
     cipher = OpenSSL::Cipher.new('aes-128-cbc')
     cipher.encrypt
     cipher.key = @cipher_key
     cipher.iv = iv = cipher.random_iv 
     cipher_text = cipher.update(encoded)
     cipher_text << cipher.final
     
     iv_cipher_text = iv + cipher_text

     sha1  = OpenSSL::Digest.new('sha1')     
     hmac = OpenSSL::HMAC.digest(sha1, @hmac_key, iv_cipher_text)
        
     return Base64.encode64(iv_cipher_text + hmac);
     
   end
   
end

