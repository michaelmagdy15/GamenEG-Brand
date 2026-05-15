// scripts/create-admin.mjs
// Run once with: node scripts/create-admin.mjs
// This creates the GAMEN admin account in Firebase Auth

const API_KEY = 'AIzaSyAUvzDIKoTvtbMEWaP1pDSyNfqpS3_11wI';
const ADMIN_EMAIL = 'admin@gamen.eg';
const ADMIN_PASSWORD = '12345678';

async function createAdmin() {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      returnSecureToken: true,
    }),
  });

  const data = await res.json();

  if (data.error) {
    if (data.error.message === 'EMAIL_EXISTS') {
      console.log('✅ Admin account already exists.');
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    } else {
      console.error('❌ Error:', data.error.message);
    }
    return;
  }

  console.log('✅ Admin account created successfully!');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   UID:      ${data.localId}`);
  console.log('');
  console.log('🔐 Login at: /admin/login');
}

createAdmin();
