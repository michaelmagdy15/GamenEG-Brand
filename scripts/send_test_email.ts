// scripts/send_test_email.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAUvzDIKoTvtbMEWaP1pDSyNfqpS3_11wI',
  authDomain: 'faa-test-guide-v2.firebaseapp.com',
  projectId: 'faa-test-guide-v2',
  storageBucket: 'faa-test-guide-v2.firebasestorage.app',
  messagingSenderId: '492280162134',
  appId: '1:492280162134:web:13744335fae3c3d52d98f7',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function triggerVerificationEmail() {
  console.log("Writing SendGrid verification payload to `/gamen_mail` collection...");
  try {
    const docRef = await addDoc(collection(db, 'gamen_mail'), {
      to: ['michaelmitry13@gmail.com'],
      from: 'info@gamen.world',
      message: {
        subject: 'Order Confirmation - GAMÉN (SendGrid SMTP Verification)',
        html: `
          <div style="font-family: sans-serif; color: #462718; text-align: center; padding: 20px;">
            <h1 style="color: #BA9A63; tracking-wider">GΛMÉN</h1>
            <h2>SendGrid Integration Verified!</h2>
            <p>Your premium e-commerce order confirmation pipeline has been successfully configured and activated.</p>
            <p style="font-style: italic; color: #888;">L'élégance taillée en bois.</p>
          </div>
        `,
      }
    });
    console.log("Success! Test document created with ID:", docRef.id);
    console.log("This will trigger your SendGrid SMTP relay to deliver the test email.");
  } catch (err) {
    console.error("Failed to write to database:", err);
  }
}

triggerVerificationEmail();
