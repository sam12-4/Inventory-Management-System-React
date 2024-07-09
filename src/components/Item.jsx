import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegListAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);


const Item = () => {
  const [items, setItems] = useState([]);
  const [addItemName, setAddItemName] = useState('');
  const [addItemQuantity, setAddItemQuantity] = useState('');
  const [addItemPrice, setAddItemPrice] = useState('');
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [chartData, setChartData] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  const prepareChartData = () => {
    const labels = items.map(item => item.Item_Name);
    const data = items.map(item => item.Item_Quantity);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Item Quantities',
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }
      ]
    });
    console.log(chartData);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    prepareChartData()
  }, [items])

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items', { headers });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('http://localhost:5000/item', { itemName: addItemName, itemQuantity: addItemQuantity, itemPrice: addItemPrice }, { headers });
      toast.success('Item added');
      fetchItems();
      setAddItemName('');
      setAddItemQuantity('');
      setAddItemPrice('');
    } catch (error) {
      toast.error('Server error');
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = (id) => {
    const item = items.find(item => item.Item_id === id);
    setEditingItemId(id);
    setEditItemName(item.Item_Name);
    setEditItemQuantity(item.Item_Quantity);
    setEditItemPrice(item.Item_Price);
    setShowEditModal(true);
  };

  const handleUpdateItem = async () => {
    try {
      await axios.put(`http://localhost:5000/item/${editingItemId}`, { itemName: editItemName, itemQuantity: editItemQuantity, itemPrice: editItemPrice }, { headers });
      toast.success('Item updated');
      fetchItems();
      setEditItemName('');
      setEditItemQuantity('');
      setEditItemPrice('');
      setEditingItemId(null);
      setShowEditModal(false);
    } catch (error) {
      toast.error('Server error');
      console.error('Error updating item:', error);
    }
  };

  const handleShowDeleteModal = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteItem = async () => {
    try {
      await axios.delete(`http://localhost:5000/item/${itemToDelete}`, { headers });
      fetchItems();
      toast.success('Item deleted');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('The Item is already in Stock! \n Please Remove the item from the stock before deleting the item.');
      console.error('Error deleting item:', error);
    }
  };

  const isAddFormValid = addItemName.length > 0 && addItemQuantity.length > 0 && addItemPrice.length > 0;
  // const isEditFormValid = editItemName.length > 0 && editItemQuantity.length > 0 && editItemPrice.length > 0;

  return (
    <>
    <div className="text-white fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      <div className="container min-h-[80.7vh]  mx-auto p-4">
        <ToastContainer />
        <h1 className="text-4xl font-bold text-center mb-8 flex justify-center items-center gap-4 mt-4 text-gray-200">
          <FaRegListAlt size={32} /> Inventory Management System
        </h1>
        <form onSubmit={e => { e.preventDefault(); handleAddItem(); }} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 databaseorm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Item Name:</label>
            <input type="text" value={addItemName} onChange={e => setAddItemName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Item Quantity:</label>
            <input type="number" value={addItemQuantity} onChange={e => setAddItemQuantity(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Item Price:</label>
            <input type="number" step="0.01" value={addItemPrice} onChange={e => setAddItemPrice(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <button type="submit" disabled={!isAddFormValid} className={`w-full py-2 px-4 font-bold text-white rounded focus:outline-none focus:shadow-outline ${isAddFormValid ? 'bg-blue-500 hover:bg-blue-700 ' : 'bg-gray-400 cursor-not-allowed'}`}>
            Add Item
          </button>
        </form>

        {items.length > 0 ? (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white shadow-md ">
              <thead className="bg-gray-200 rounded-lg">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-bold text-gray-700">Item Name</th>
                  <th className="py-3 px-6 text-left text-sm font-bold text-gray-700">Item Quantity</th>
                  <th className="py-3 px-6 text-left text-sm font-bold text-gray-700">Item Price (Rs)</th>
                  <th className="py-3 px-6 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className='bg-slate-100'>
                {items.map(item => (
                  <tr key={item.Item_id} className="border-t">
                    <td className="py-3 px-6 text-left">{item.Item_Name}</td>
                    <td className="py-3 px-6 text-left">{item.Item_Quantity}</td>
                    <td className="py-3 px-6 text-left">{item.Item_Price}</td>
                    <td className="py-3 px-6 text-center md:flex md:justify-center">
                      <button onClick={() => handleEditItem(item.Item_id)} className="mr-2 py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-700 md:mb-0 mb-2 md:w-fit w-full">Edit</button>
                      <button onClick={() => handleShowDeleteModal(item.Item_id)} className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">No items found. Add an item to get started.</p>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
              <h2 className="text-xl mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this item?</p>
              <div className="mt-4 flex justify-end ">
                <button onClick={() => setShowDeleteModal(false)} className="mr-4 py-2 px-4 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleDeleteItem} className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
              <h2 className="text-xl mb-4">Edit Item</h2>
              <form onSubmit={e => { e.preventDefault(); handleUpdateItem(); }} className="bg-white rounded px-8 pt-6 pb-8">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Item Name:</label>
                  <input type="text" value={editItemName} onChange={e => setEditItemName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Item Quantity:</label>
                  <input type="number" value={editItemQuantity} onChange={e => setEditItemQuantity(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Item Price:</label>
                  <input type="number" step="0.01" value={editItemPrice} onChange={e => setEditItemPrice(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setShowEditModal(false)} className="mr-4 py-2 px-4 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                  <button type="submit" className={`py-2 px-4 font-bold text-white rounded focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700`}>Update</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {items.length>0 && <div className="mt-10">
          {chartData && (
            <>
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-200">Analysis of items</h1>
            <div className="w-full max-w-md mx-auto bg-white p-4 shadow-md rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-center">
                Item Quantities
              </h2>
              <Pie data={chartData} />
            </div>
            </>
          )}
        </div>}
      </div>
    </>
  );
};

export default Item;
