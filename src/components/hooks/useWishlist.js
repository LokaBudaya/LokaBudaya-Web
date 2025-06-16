import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../lib/firebase';

export const useWishlist = () => {
  const [user] = useAuthState(auth);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateItemId = (item, type) => {
    const title = (item.title || item.nama_event || 'Untitled').replace(/\s+/g, ' ').trim();
    const price = item.price || item.harga_tiket || 0;
    const itemType = type.toLowerCase();
    return `${title}_${price}_${itemType}`;
  };

  const loadWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const favoritesRef = collection(db, 'users', user.uid, 'favorites');
      const snapshot = await getDocs(favoritesRef);
      
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setWishlistItems(items);
      console.log('Loaded wishlist:', items.length, 'items');
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (item, type) => {
    const itemId = generateItemId(item, type);
    return wishlistItems.some(wishItem => wishItem.itemId === itemId);
  };

  const toggleWishlist = async (item, type) => {
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    const itemId = generateItemId(item, type);
    const isCurrentlyInWishlist = isInWishlist(item, type);

    try {
      const favoriteData = {
        itemId: itemId,
        itemType: type.toLowerCase(),
        addedAt: serverTimestamp()
      };

      // Document ID sama dengan itemId
      const docRef = doc(db, 'users', user.uid, 'favorites', itemId);

      if (isCurrentlyInWishlist) {
        await deleteDoc(docRef);
        setWishlistItems(prev => 
          prev.filter(wishItem => wishItem.itemId !== itemId)
        );
        console.log('Removed from wishlist:', itemId);
      } else {
        await setDoc(docRef, favoriteData);
        setWishlistItems(prev => [...prev, { id: itemId, ...favoriteData }]);
        console.log('Added to wishlist:', itemId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  return {
    wishlistItems,
    loading,
    isInWishlist,
    toggleWishlist,
    refreshWishlist: loadWishlist
  };
};