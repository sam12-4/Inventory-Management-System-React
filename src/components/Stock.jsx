import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegListAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Doughnut } from 'react-chartjs-2';

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [items, setItems] = useState([]);
  const [addItemId, setAddItemId] = useState('');
  const [addQuantity, setAddQuantity] = useState('');
  const [addLastUpdated, setAddLastUpdated] = useState('');
  const [addExpirationDate, setAddExpirationDate] = useState('');
  const [editItemId, setEditItemId] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editLastUpdated, setEditLastUpdated] = useState('');
  const [editExpirationDate, setEditExpirationDate] = useState('');
  const [editingStockId, setEditingStockId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => {
    fetchStocks();
    fetchItems();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stocks', { headers });
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
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

  const handleAddStock = async () => {
    // Validate Quantity field
    if (!addQuantity || isNaN(addQuantity)) {
      toast.error('Quantity must be a valid number');
      return;
    }

    try {
      await axios.post('http://localhost:5000/stocks', {
        Item_id: addItemId,
        Quantity: addQuantity,
        Last_Updated: addLastUpdated,
        Expiration_date: addExpirationDate
      }, { headers });
      
      // Handle success
      toast.success('Stock added successfully');
      fetchStocks();
      setAddItemId('');
      setAddQuantity('');
      setAddLastUpdated('');
      setAddExpirationDate('');
    } catch (error) {
      // Handle error
      toast.error('Server error');
      console.error('Error adding stock:', error);
    }
  };

  const handleEditStock = async () => {
    try {
      await axios.put(`http://localhost:5000/stocks/${editingStockId}`, {
        Item_id: editItemId,
        Quantity: editQuantity,
        Last_Updated: editLastUpdated,
        Expiration_date: editExpirationDate
      }, { headers });

      setShowEditModal(false);
      toast.success('Stock updated');
      fetchStocks();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error updating stock');
    }
  };

  const handleDeleteStock = async () => {
    try {
      await axios.delete(`http://localhost:5000/stocks/${stockToDelete}`, { headers });

      setShowDeleteModal(false);
      toast.success('Stock deleted');
      fetchStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Error deleting stock');
    }
  };

  const openEditModal = (stock) => {
    setEditingStockId(stock.Stock_id);
    setEditItemId(stock.Item_id);
    setEditQuantity(stock.Quantity);
    setEditLastUpdated(stock.Last_Updated);
    setEditExpirationDate(stock.Expiration_date);
    setShowEditModal(true);
  };

  const openDeleteModal = (stock) => {
    setStockToDelete(stock.Stock_id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const isAddFormValid = addItemId.length > 0 && addQuantity.length > 0 && addLastUpdated.length > 0 && addExpirationDate.length > 0;

  // Helper function to get item name by item ID
  const getItemName = (itemId) => {
    const item = items.find(item => item.Item_id === itemId);
    return item ? item.Item_Name : 'Unknown Item';
  };

  // Calculate data for Doughnut chart
  const calculateChartData = () => {
    const data = {};
    stocks.forEach(stock => {
      const itemName = getItemName(stock.Item_id);
      if (!data[itemName]) {
        data[itemName] = stock.Quantity;
      } else {
        data[itemName] += stock.Quantity;
      }
    });

    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8c44fc', '#ed4b82', '#ffcdd2'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8c44fc', '#ed4b82', '#ffcdd2']
      }]
    };
  };

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: '#333',
        fontSize: 12
      }
    }
  };

  return (
    <>
      <div className="text-white fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      <div className="container min-h-[80.7vh] mx-auto p-4">
        <ToastContainer />
        <h1 className="text-4xl font-bold text-center mb-8 flex justify-center items-center gap-4 mt-4 text-gray-200">
          <FaRegListAlt size={32} /> Stock Management
        </h1>
        <form onSubmit={e => { e.preventDefault(); handleAddStock(); }} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 databaseForm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Item Name:</label>
            <select value={addItemId} onChange={e => setAddItemId(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Select Item</option>
              {items.map(item => (
                <option key={item.Item_id} value={item.Item_id}>{item.Item_Name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
            <input type="number" value={addQuantity} onChange={e => setAddQuantity(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Last Updated:</label>
            <input type="date" value={addLastUpdated} onChange={e => setAddLastUpdated(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Expiration Date:</label>
            <input type="date" value={addExpirationDate} onChange={e => setAddExpirationDate(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <button type="submit" disabled={!isAddFormValid} className={`w-full py-2 px-4 font-bold text-white rounded focus:outline-none focus:shadow-outline ${isAddFormValid ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}>
            Add Stock
          </button>
        </form>

        {stocks.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg mb-8">
              <table className="min-w-full bg-white shadow-md">
                <thead className="bg-gray-200 rounded-lg">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-bold text-gray-700">Item Name</th>
                    <th className="py-3 px-6 text-left text-sm font-bold text-gray-700">Quantity</th>
                    <th className="py-3 px-6 text-left text-sm font-bold text-gray-700">Last Updated</th>
                    <th className="py-3 px-6 text-left text-sm font-bold text-gray-700">Expiration Date</th>
                    <th className="py-3 px-6 text-center text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-slate-100'>
                  {stocks.map(stock => (
                    <tr key={stock.Stock_id} className="border-t">
                      <td className="py-3 px-6 text-left">{getItemName(stock.Item_id)}</td>
                      <td className="py-3 px-6 text-left">{stock.Quantity}</td>
                      <td className="py-3 px-6 text-left">{stock.Last_Updated.slice(0,10)}</td>
                      <td className="py-3 px-6 text-left">{stock.Expiration_date.slice(0, 10)}</td>
                      <td className="py-3 px-6 text-center md:flex md:justify-center">
                        <button onClick={() => openEditModal(stock)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline md:mb-0 mb-2 md:w-fit w-full">Edit</button>
                        <button onClick={() => openDeleteModal(stock)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className="text-xl font-bold mb-4 text-center text-white">Stock Distribution</h2>
            <div className="mb-8">
              <Doughnut data={calculateChartData()} options={chartOptions} />
            </div>
          </>
        ) : (
          <p className="text-gray-200 text-center">No stocks available</p>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Stock</h2>
            <form onSubmit={e => { e.preventDefault(); handleEditStock(); }}>
              <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-2">Item Name:</label>
                <select value={editItemId} onChange={e => setEditItemId(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="">Select Item</option>
                  {items.map(item => (
                    <option key={item.Item_id} value={item.Item_id} disabled>{item.Item_Name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
                <input type="number" value={editQuantity} onChange={e => setEditQuantity(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Last Updated:</label>
                <input type="date" value={editLastUpdated} onChange={e => setEditLastUpdated(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Expiration Date:</label>
                <input type="date" value={editExpirationDate} onChange={e => setEditExpirationDate(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="flex justify-between gap-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Changes</button>
                <button onClick={() => setShowEditModal(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this stock?</p>
            <div className="flex justify-between">
              <button onClick={handleDeleteStock} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
              <button onClick={closeDeleteModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stock;
