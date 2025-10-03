// Encrypted Prayer Request System
// Uses Web Crypto API for client-side encryption

class EncryptedPrayerSystem {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for GCM
  }

  // Generate a new encryption key (for admins to share securely)
  async generateKey() {
    const key = await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
    
    // Export key for sharing with admins
    const exportedKey = await crypto.subtle.exportKey('jwk', key);
    return {
      key: key,
      exportedKey: exportedKey,
      keyString: JSON.stringify(exportedKey)
    };
  }

  // Import a key from string (for admins to use)
  async importKey(keyString) {
    try {
      const keyData = JSON.parse(keyString);
      return await crypto.subtle.importKey(
        'jwk',
        keyData,
        {
          name: this.algorithm,
          length: this.keyLength
        },
        false, // not extractable for security
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      throw new Error('Invalid encryption key');
    }
  }

  // Encrypt prayer request
  async encryptPrayerRequest(plaintext, key) {
    try {
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
      
      // Convert text to bytes
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);
      
      // Encrypt
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        data
      );
      
      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
      
    } catch (error) {
      throw new Error('Encryption failed: ' + error.message);
    }
  }

  // Decrypt prayer request (for admins only)
  async decryptPrayerRequest(encryptedData, key) {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, this.ivLength);
      const encrypted = combined.slice(this.ivLength);
      
      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        key,
        encrypted
      );
      
      // Convert back to text
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
      
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }

  // Create encrypted prayer request object
  async createEncryptedPrayerRequest(name, request, email, encryptionKey) {
    const timestamp = new Date().toISOString();
    
    // Create prayer request object
    const prayerData = {
      name: name || 'Anonymous',
      request: request,
      email: email || null,
      timestamp: timestamp,
      submittedBy: 'LLF Website'
    };
    
    // Encrypt the sensitive data
    const encryptedContent = await this.encryptPrayerRequest(
      JSON.stringify(prayerData), 
      encryptionKey
    );
    
    // Create public metadata (not encrypted)
    return {
      id: Date.now(),
      timestamp: timestamp,
      hasName: !!name,
      hasEmail: !!email,
      encryptedContent: encryptedContent,
      status: 'new',
      version: '1.0'
    };
  }

  // Decrypt prayer request for admin viewing
  async decryptPrayerRequestForAdmin(encryptedPrayerRequest, decryptionKey) {
    try {
      const decryptedContent = await this.decryptPrayerRequest(
        encryptedPrayerRequest.encryptedContent,
        decryptionKey
      );
      
      const prayerData = JSON.parse(decryptedContent);
      
      return {
        ...encryptedPrayerRequest,
        decryptedData: prayerData
      };
    } catch (error) {
      throw new Error('Failed to decrypt prayer request: ' + error.message);
    }
  }

  // Generate a secure admin key and instructions
  async generateAdminKeyPackage() {
    const keyInfo = await this.generateKey();
    
    const instructions = `
# LLF Prayer Request Admin Key

## Security Instructions:
1. Keep this key absolutely confidential
2. Only share with authorized prayer team leaders
3. Store in a secure password manager
4. Never commit this key to version control

## Admin Key:
${keyInfo.keyString}

## How to Use:
1. Go to the admin prayer dashboard
2. Paste this key in the decryption field
3. You can now view decrypted prayer requests

## Key Generated: ${new Date().toISOString()}
`;

    return {
      key: keyInfo.key,
      keyString: keyInfo.keyString,
      instructions: instructions
    };
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.EncryptedPrayerSystem = EncryptedPrayerSystem;
}