// src/crud.js
import { supabase } from './supabaseClient';

export const getItems = async () => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
  return data;
};

export const createItem = async (name, number) => {
  const { data, error } = await supabase.from('items').insert([{ name, number }]);
  if (error) {
    console.error('Error creating item:', error);
    throw error;
  }
  return data;
};

export const updateItem = async (id, name, number) => {
  const { data, error } = await supabase.from('items').update({ name, number }).eq('id', id);
  if (error) {
    console.error('Error updating item:', error);
    throw error;
  }
  return data;
};

export const deleteItem = async (id) => {
  const { data, error } = await supabase.from('items').delete().eq('id', id);
  if (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
  return data;
};
