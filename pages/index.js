// pages/index.js
import { useEffect, useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { getItems, createItem, updateItem, deleteItem } from '../src/crud';
import { useRouter } from 'next/router';

export default function Home() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchItems();
      } else {
        router.push('/login');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      } else if (event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await createItem(name, number);
      fetchItems();
      setName('');
      setNumber('');
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      await updateItem(id, name, number);
      fetchItems();
      setEditId(null);
      setName('');
      setNumber('');
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteItem(id);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setNumber(item.number);
    setEditId(item.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Supabase CRUD with Next.js</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      {editId ? (
        <button onClick={() => handleUpdate(editId)} disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      ) : (
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      )}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.number}
            <button onClick={() => handleEdit(item)} disabled={loading}>
              Edit
            </button>
            <button onClick={() => handleDelete(item.id)} disabled={loading}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
