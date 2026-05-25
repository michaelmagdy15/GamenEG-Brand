import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { products } from '../src/data/products';

async function seedProducts() {
  try {
    console.log(`Seeding ${products.length} products to "gamen_products" collection in Firestore...`);
    for (const p of products) {
      // Destructure to separate ID and get the rest of the fields
      const { id, ...productData } = p;
      const docRef = doc(db, 'gamen_products', id);
      
      // Perform an idempotent upsert of the product document
      await setDoc(docRef, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      console.log(`Successfully seeded/updated product: "${p.name}" (ID: ${id})`);
    }
    console.log('Seeding GΛMÉN products complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
