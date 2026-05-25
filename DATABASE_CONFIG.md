# GΛMÉN Brand Storefront — Database Configuration & Namespacing Guide

This document defines the architectural integration between the **GΛMÉN Premium Storefront** and the shared Firebase project. Retain this guide to preserve database safety across future coding sessions or when setting up the development environment on other machines.

---

## 1. Core Architecture & Project Details

*   **Shared Firebase Project ID**: `faa-test-guide-v2`
*   **Target Backend System**: Both **GΛMÉN Storefront** and **Strike CRM (Gym CRM)** operate on this single Firebase project.
*   **Isolation Strategy**: **Namespaced Collection Prefixing**. 

To prevent data corruption, schema overlaps, or broken authentication/rules clashing, the GΛMÉN codebase is explicitly namespaced. **All GΛMÉN-specific database tables are prefixed with `gamen_`**, leaving Strike CRM's default collections (`products`, `orders`, `users`, `payments`) completely untouched.

---

## 2. Collection Mapping Directory

Any database query or document write must strictly map to these namespaced collections:

| Logical Entity | GΛMÉN Namespaced Collection | Strike CRM Default Collection (Do NOT touch) |
| :--- | :--- | :--- |
| **Products Catalog** | `gamen_products` | `products` (clash prevented) |
| **Customer Orders** | `gamen_orders` | `orders` (clash prevented) |
| **Trigger Email Logs**| `gamen_mail` | `mail` (clash prevented) |
| **Product Overrides** | `gamen_productOverrides` | `productOverrides` (clash prevented) |

---

## 3. Code Integration References

### Database Operations File
All Firestore queries are isolated in [`src/lib/firestore.ts`](file:///c:/Users/Mi5a/GamenEG-Brand/src/lib/firestore.ts). 
When editing database methods, **always use the prefixed collection names**:
```typescript
// Correct
const q = query(collection(db, 'gamen_products'), orderBy('createdAt', 'desc'));

// Incorrect (will corrupt Strike CRM)
const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
```

### Authentication & Dashboard Route Safety
Client-side administrator permissions are locked explicitly to the client's verified admin email:
*   File: [`src/context/AdminAuthContext.tsx`](file:///c:/Users/Mi5a/GamenEG-Brand/src/context/AdminAuthContext.tsx)
*   File: [`src/components/AdminRoute.tsx`](file:///c:/Users/Mi5a/GamenEG-Brand/src/components/AdminRoute.tsx)
*   *Validation Check*: `isAdmin = !!admin && admin.email === 'michaelmitry13@gmail.com'`

---

## 4. Deployed Security Rules Configuration

The security bounds are hardcoded in [`firestore.rules`](file:///c:/Users/Mi5a/GamenEG-Brand/firestore.rules). They target the `gamen_` prefixed keys exclusively, keeping Strike CRM's access controls completely untouched.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Only michaelmitry13@gmail.com has full admin rights
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'michaelmitry13@gmail.com';
    }

    // GΛMÉN Orders: anyone can submit pending orders with strict schema checks
    match /gamen_orders/{orderId} {
      allow create: if request.resource.data.keys().hasAll(['orderRef', 'status', 'customer', 'items', 'totalPrice'])
                    && request.resource.data.status == 'pending'
                    && request.resource.data.customer.email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
                    && request.resource.data.customer.phone.size() >= 10;
      allow read, update, delete: if isAdmin();
    }

    // GΛMÉN Products: public read, admin-only write
    match /gamen_products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // GΛMÉN Mail: restricts relay writes to prevent spam campaigns
    match /gamen_mail/{mailId} {
      allow create: if request.resource.data.keys().hasAll(['to', 'message'])
                    && request.resource.data.to.size() <= 2
                    && request.resource.data.message.subject.startsWith('Order Confirmation - GAMÉN');
      allow read, update, delete: if isAdmin();
    }
  }
}
```

---

## 5. Local Development & Deployment Command

To deploy the rules to the backend without overwriting Strike CRM's other database indexes or files:
1. Log in to Firebase CLI: `firebase login`
2. Connect the CLI to the project: `firebase use faa-test-guide-v2`
3. Deploy Firestore rules and indexes only:
   ```bash
   firebase deploy --only firestore:rules
   ```

*Follow this protocol to maintain absolute data safety, extreme performance, and professional engineering standards.*
