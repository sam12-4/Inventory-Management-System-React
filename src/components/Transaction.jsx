import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegListAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [items, setItems] = useState([]);
  const [addItemId, setAddItemId] = useState('');
  const [addSeller, setAddSeller] = useState('');
  const [addItemQuantity, setAddItemQuantity] = useState('');
  const [addDate, setAddDate] = useState('');
  const [editItemId, setEditItemId] = useState('');
  const [editSeller, setEditSeller] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => {
    fetchTransactions();
    fetchItems();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/transactions', { headers });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items', { headers });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await axios.post('http://localhost:5000/transaction', {
        itemId: addItemId,
        seller: addSeller,
        itemQuantity: addItemQuantity,
        date: addDate,
      }, { headers });
      toast.success('Transaction added successfully');
      fetchTransactions();
      setAddItemId('');
      setAddSeller('');
      setAddItemQuantity('');
      setAddDate('');
    } catch (error) {
      toast.error('Server error');
      console.error('Error adding transaction:', error);
    }
  };

  const handleEditTransaction = (id) => {
    const transaction = transactions.find(transaction => transaction.Transaction_id === id);
    setEditingTransactionId(id);
    setEditItemId(transaction.Item_id);
    setEditSeller(transaction.Seller);
    setEditItemQuantity(transaction.Item_Quantity);
    setEditDate(transaction.Date);
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async () => {
    try {
      await axios.put(`http://localhost:5000/transaction/${editingTransactionId}`, {
        itemId: editItemId,
        seller: editSeller,
        itemQuantity: editItemQuantity,
        date: editDate,
      }, { headers });
      toast.success('Transaction updated');
      fetchTransactions();
      setEditItemId('');
      setEditSeller('');
      setEditItemQuantity('');
      setEditDate('');
      setEditingTransactionId(null);
      setShowEditModal(false);
    } catch (error) {
      toast.error('Server error');
      console.error('Error updating transaction:', error);
    }
  };

  const handleShowDeleteModal = (id) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteTransaction = async () => {
    try {
      await axios.delete(`http://localhost:5000/transaction/${transactionToDelete}`, { headers });
      fetchTransactions();
      toast.success('Transaction deleted');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Server error');
      console.error('Error deleting transaction:', error);
    }
  };

  const isAddFormValid = addItemId.length > 0 && addSeller.length > 0 && addItemQuantity.length > 0 && addDate.length > 0;

  // Helper function to get item name by item ID
  const getItemName = (itemId) => {
    const item = items.find(item => item.Item_id === itemId);
    return item ? item.Item_Name : 'Unknown Item';
  };

  // Prepare data for the chart
  const chartData = {
    labels: transactions.map(transaction => transaction.Seller),
    datasets: [
      {
        label: 'Item Quantity',
        data: transactions.map(transaction => transaction.Item_Quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div className="text-white fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      <div className="container min-h-[80.7vh] mx-auto p-4">
        <ToastContainer />
        <h1 className="text-4xl font-bold text-center mb-8 flex justify-center items-center gap-4 mt-4 text-gray-200">
          <FaRegListAlt size={32} /> Transactions Management
        </h1>
        <form onSubmit={e => { e.preventDefault(); handleAddTransaction(); }} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 databaseForm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Item ID:</label>
            <select value={addItemId} onChange={e => setAddItemId(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Select Item</option>
              {items.map(item => (
                <option key={item.Item_id} value={item.Item_id}>{item.Item_Name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Seller:</label>
            <input type="text" value={addSeller} onChange={e => setAddSeller(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Item Quantity:</label>
            <input type="number" value={addItemQuantity} onChange={e => setAddItemQuantity(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
            <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" disabled={!isAddFormValid} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:bg-blue-400">Add Transaction</button>
          </div>
        </form>
        {transactions.length>0 ? <div className="w-full rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Transactions List</h2>
          <div className='rounded-lg bg-slate-100 overflow-x-auto'>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="rounded-lg">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center">ID</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center">Item Name</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center">Seller</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center">Item Quantity</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center">Date</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className='bg-slate-100'>
              {transactions.map(transaction => (
                <tr key={transaction.Transaction_id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{transaction.Transaction_id}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{getItemName(transaction.Item_id)}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{transaction.Seller}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{transaction.Item_Quantity}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{transaction.Date.slice(0, 10)}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    <button onClick={() => handleEditTransaction(transaction.Transaction_id)} className="mr-2 py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-700 md:mb-0 mb-2 md:w-fit w-full">Edit</button>
                    <button onClick={() => handleShowDeleteModal(transaction.Transaction_id)} className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div> : <div className="w-full bg-white rounded-lg shadow-md p-4 mt-8"> 
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">No Transactions Found</h2>
        </div>}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
              <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
              <form onSubmit={e => { e.preventDefault(); handleUpdateTransaction(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Item ID:</label>
                  <select value={editItemId} onChange={e => setEditItemId(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select Item</option>
                    {items.map(item => (
                      <option key={item.Item_id} value={item.Item_id}>{item.Item_Name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Seller:</label>
                  <input type="text" value={editSeller} onChange={e => setEditSeller(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Item Quantity:</label>
                  <input type="number" value={editItemQuantity} onChange={e => setEditItemQuantity(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
                  <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="flex items-center justify-between">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update Transaction</button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
              <h2 className="text-xl font-bold mb-4">Delete Transaction</h2>
              <p className="mb-4">Are you sure you want to delete this transaction?</p>
              <div className="flex items-center justify-between">
                <button onClick={handleDeleteTransaction} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
                <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
              </div>
            </div>
          </div>
        )}
        {transactions.length>0 && <div className="w-full bg-white rounded-lg shadow-md p-4 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Transaction Statistics</h2>
          <div className="relative h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>}
      </div>
    </>
  );
};

export default Transaction;
