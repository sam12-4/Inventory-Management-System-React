import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegListAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [addItemId, setAddItemId] = useState('');
  const [addItemQuantity, setAddItemQuantity] = useState('');
  const [addDate, setAddDate] = useState('');
  const [editItemId, setEditItemId] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [totalSalesData, setTotalSalesData] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      fetchSales();
    }
  }, [items]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sales', { headers });
      setSales(response.data);
      calculateTotalSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
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

  const getItemName = (itemId) => {
    const item = items.find((item) => item.Item_id === itemId);
    // console.log(item);
    // console.log(item.Item_Name);
    return item ? item.Item_Name : 'Unknown';
  };

  const calculateTotalSales = (salesData) => {
    const salesByItem = salesData.reduce((acc, sale) => {
      if (acc[sale.Item_id]) {
        acc[sale.Item_id] += sale.Qty;
      } else {
        acc[sale.Item_id] = sale.Qty;
      }
      return acc;
    }, {});
    
    const totalSalesArray = Object.keys(salesByItem).map((itemId, index) => ({
      itemId,
      itemName: `Item ${index + 1}`, // Assign generic item names
      totalSales: salesByItem[itemId],
    }));
    
    setTotalSalesData(totalSalesArray);
  };

  const handleAddSale = async (e) => {
    e.preventDefault();

    if (!addItemQuantity || isNaN(addItemQuantity)) {
      toast.error('Quantity must be a valid number');
      return;
    }

    try {
      await axios.post('http://localhost:5000/sales', {
        Item_id: addItemId,
        Qty: addItemQuantity,
        Date: addDate
      }, { headers });

      toast.success('Sale added successfully');
      fetchSales();
      setAddItemId('');
      setAddItemQuantity('');
      setAddDate('');
    } catch (error) {
      toast.error('Server error');
      console.error('Error adding sale:', error);
    }
  };

  const handleEditSale = async () => {
    try {
      await axios.put(`http://localhost:5000/sales/${editingSaleId}`, {
        Item_id: editItemId,
        Qty: editItemQuantity,
        Date: editDate
      }, { headers });

      setShowEditModal(false);
      toast.success('Sale updated');
      fetchSales();
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Error updating sale');
    }
  };

  const handleDeleteSale = async () => {
    try {
      await axios.delete(`http://localhost:5000/sales/${saleToDelete}`, { headers });

      setShowDeleteModal(false);
      toast.success('Sale deleted');
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Error deleting sale');
    }
  };

  const openEditModal = (sale) => {
    setEditingSaleId(sale.Sales_id);
    setEditItemId(sale.Item_id);
    setEditItemQuantity(sale.Qty);
    setEditDate(sale.Date);
    setShowEditModal(true);
  };

  const openDeleteModal = (sale) => {
    setSaleToDelete(sale.Sales_id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const chartData = {
    labels: totalSalesData.map((data) => data.itemName),
    datasets: [
      {
        label: 'Total Sales',
        data: totalSalesData.map((data) => data.totalSales),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div className="text-white fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      <div className="container mx-auto px-4 py-8 min-h-[81.3vh]">
        <h2 className="text-3xl text-center font-bold text-gray-200 flex justify-center items-center mt-4 mb-8">
          <FaRegListAlt className="inline-block mr-2" /> Sales Management
        </h2>

        {/* Add Sale Form */}
        <form onSubmit={handleAddSale} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemSelect">
              Item Name
            </label>
            <select
              id="itemSelect"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={addItemId}
              onChange={(e) => setAddItemId(e.target.value)}
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.Item_id} value={item.Item_id}>
                  {item.Item_Name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantityInput">
              Sales
            </label>
            <input
              id="quantityInput"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Enter Sales"
              value={addItemQuantity}
              onChange={(e) => setAddItemQuantity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateInput">
              Date
            </label>
            <input
              id="dateInput"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              value={addDate}
              onChange={(e) => setAddDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={!addItemId || !addItemQuantity || !addDate}
          >
            Add Sale
          </button>
        </form>

        {/* Sales Table */}
        {sales.length > 0 ? (
          <div className="overflow-x-auto  mb-8">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Item Name</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.Sales_id}>
                    <td className="py-3 px-6 text-left">{getItemName(sale.Item_id)}{console.log("sale id", sale.Item_id)}</td>
                    <td className="py-3 px-6 text-left">{sale.Qty}</td>
                    <td className="py-3 px-6 text-left">{sale.Date.slice(0, 10)}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => openEditModal(sale)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(sale)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-white">No sales data available</p>
        )}

        {/* Bar Chart */}
        {totalSalesData.length > 0 && (
          <div className="bg-white shadow-md rounded p-4 mb-8">
            <h3 className="text-xl font-bold mb-4">Total Sales</h3>
            <div className="w-full h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Edit Sale Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-8 shadow-lg max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Edit Sale</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editItemSelect">
                  Item Name
                </label>
                <select
                  id="editItemSelect"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={editItemId}
                  onChange={(e) => setEditItemId(e.target.value)}
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.Item_id} value={item.Item_id}>
                      {item.Item_Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editQuantityInput">
                  Sales
                </label>
                <input
                  id="editQuantityInput"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Enter Sales"
                  value={editItemQuantity}
                  onChange={(e) => setEditItemQuantity(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="editDateInput">
                  Date
                </label>
                <input
                  id="editDateInput"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleEditSale}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Sale Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-8 shadow-lg max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this sale?</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleDeleteSale}
              >
                Delete
              </button>
              <button
                type="button"
                className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Sales;
