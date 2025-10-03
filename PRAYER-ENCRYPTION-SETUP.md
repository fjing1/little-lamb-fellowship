# 🔒 LLF Encrypted Prayer Request System

## Overview

The Little Lamb Fellowship website now includes a secure, encrypted prayer request system that ensures complete privacy and confidentiality for all prayer submissions. This system uses military-grade AES-256-GCM encryption to protect sensitive prayer requests.

## 🔐 How It Works

### For Users (Prayer Submitters)
1. **Submit Prayer**: Users fill out the prayer form on the contact page
2. **Client-Side Encryption**: The prayer is encrypted in the browser using AES-256-GCM
3. **Secure Storage**: Only the encrypted data is transmitted and stored
4. **No Plain Text**: The actual prayer content never leaves the user's browser unencrypted

### For Admins (Prayer Team Leaders)
1. **Admin Key**: Authorized leaders receive a secure decryption key
2. **Admin Dashboard**: Access encrypted prayers through the admin interface
3. **Decrypt & View**: Use the admin key to decrypt and read prayer requests
4. **Secure Management**: Export, manage, and track prayer requests securely

## 🚀 Setup Instructions

### Step 1: Generate Admin Keys

1. **Access Admin Dashboard**: Go to `https://your-site.com/admin-prayers.html`
2. **Generate Key**: Click "Generate New Key" button
3. **Save Securely**: Copy and save the generated key in a secure password manager
4. **Share with Leaders**: Securely share the key only with authorized prayer team leaders

### Step 2: Configure Encryption

The system works out-of-the-box with demo keys, but for production:

1. **Generate Production Key**: Use the admin dashboard to generate a production key
2. **Update Contact Form**: Replace the demo key in `contact.html`:
   ```javascript
   const PUBLIC_ENCRYPTION_KEY = `{"kty":"oct","k":"YOUR_ACTUAL_KEY","alg":"A256GCM","use":"enc"}`;
   ```

### Step 3: Set Up Storage Backend

Choose one of these storage methods:

#### Option A: Formspree (Recommended)
- ✅ Already configured
- ✅ Encrypted data sent to your email
- ✅ No additional setup required

#### Option B: GitHub Issues
- ✅ Stores as private GitHub issues
- ✅ Built-in tracking and management
- ⚙️ Requires GitHub token setup

#### Option C: Local Storage (Demo Only)
- ✅ Works immediately for testing
- ❌ Not suitable for production
- ❌ Data only stored in browser

## 🔑 Admin Key Management

### Key Security Best Practices

1. **Generate Unique Keys**: Each deployment should have its own unique key
2. **Secure Storage**: Store keys in enterprise password managers
3. **Limited Access**: Only share with authorized prayer team leaders
4. **Regular Rotation**: Consider rotating keys periodically
5. **Backup Keys**: Keep secure backups of admin keys

### Key Sharing Protocol

1. **In-Person Transfer**: Share keys face-to-face when possible
2. **Encrypted Channels**: Use Signal, ProtonMail, or similar for remote sharing
3. **Never Email**: Don't send keys via regular email or text
4. **Verify Recipients**: Confirm identity before sharing keys

## 📱 Using the Admin Dashboard

### Accessing the Dashboard

1. **Navigate**: Go to `https://your-site.com/admin-prayers.html`
2. **Enter Key**: Paste your admin decryption key
3. **Test Key**: Click "Test Key" to verify it works
4. **Load Prayers**: Click "Load Prayer Requests" to view encrypted submissions

### Dashboard Features

- **🔓 Decrypt Prayers**: View the actual prayer content
- **📊 Prayer Statistics**: See submission counts and dates
- **📤 Export Data**: Download prayers for offline review
- **🔄 Refresh**: Load new prayer submissions
- **🔒 Security Indicators**: Visual confirmation of encryption status

## 🛡️ Security Features

### Encryption Specifications
- **Algorithm**: AES-256-GCM (Advanced Encryption Standard)
- **Key Length**: 256 bits (military-grade security)
- **IV Generation**: Cryptographically secure random IVs
- **Authentication**: Built-in message authentication

### Privacy Protections
- **Client-Side Encryption**: Prayers encrypted before leaving user's device
- **Zero-Knowledge**: Server never sees unencrypted prayer content
- **Metadata Protection**: Only basic metadata (timestamp, has_name) is visible
- **No Logging**: Encryption keys are never logged or stored

### Security Measures
- **Honeypot Protection**: Automatic spam filtering
- **Input Validation**: Prevents malicious input
- **XSS Protection**: HTML escaping for all user content
- **HTTPS Required**: All communications encrypted in transit

## 🚨 Emergency Procedures

### If Admin Key is Lost
1. **Generate New Key**: Use the admin dashboard to create a new key
2. **Update Forms**: Replace the public key in contact.html
3. **Notify Team**: Inform all prayer leaders of the new key
4. **Archive Old Prayers**: Export any prayers encrypted with the old key

### If Key is Compromised
1. **Immediate Action**: Generate a new key immediately
2. **Revoke Access**: Change all systems using the compromised key
3. **Audit Access**: Review who had access to the compromised key
4. **Secure Communication**: Notify team through secure channels only

## 📋 Maintenance Checklist

### Weekly
- [ ] Check admin dashboard for new prayer requests
- [ ] Verify encryption is working properly
- [ ] Review prayer team access

### Monthly
- [ ] Export prayer data for backup
- [ ] Review security logs (if available)
- [ ] Test admin key functionality

### Quarterly
- [ ] Consider key rotation
- [ ] Review team member access
- [ ] Update security procedures if needed

## 🆘 Troubleshooting

### Common Issues

**"Invalid admin key" error**
- Verify the key was copied completely
- Check for extra spaces or line breaks
- Ensure you're using the correct key for this deployment

**"Decryption failed" error**
- Prayer may have been encrypted with a different key
- Key may have been rotated since prayer was submitted
- Contact system administrator

**"Failed to load prayers" error**
- Check internet connection
- Verify storage backend is configured correctly
- Try refreshing the page

### Getting Help

1. **Check Console**: Open browser developer tools for error messages
2. **Test Environment**: Try the system in a clean browser session
3. **Contact Admin**: Reach out to the technical administrator
4. **Documentation**: Review this guide for setup steps

## 📞 Support Contacts

- **Technical Issues**: Contact your website administrator
- **Key Management**: Contact prayer team leadership
- **Security Concerns**: Contact church leadership immediately

---

*This system ensures that prayer requests remain completely confidential and can only be accessed by authorized prayer team leaders with the proper decryption keys.*