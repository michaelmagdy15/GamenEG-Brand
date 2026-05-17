import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { products } from '../products_temp2'; // We will use the temporary file I created

async function seedProducts() {
  try {
    const productsRef = collection(db, 'products');
    console.log(`Seeding ${products.length} products to Firestore...`);
    for (const p of products) {
      // Remove the local ID and create a new doc in firestore
      const { id, ...productData } = p;
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
      });
      console.log(`Added product ${p.name} with ID: ${docRef.id}`);
    }
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
