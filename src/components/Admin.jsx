import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';

const AdminDashboard = () => {
  const [itemsData, setItemsData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [stocksData, setStocksData] = useState(null);
  const [transactionsData, setTransactionsData] = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => {
    axios.get('http://localhost:5000/items', { headers }).then(response => setItemsData(response.data));
    axios.get('http://localhost:5000/sales', { headers }).then(response => setSalesData(response.data));
    axios.get('http://localhost:5000/stocks', { headers }).then(response => setStocksData(response.data));
    axios.get('http://localhost:5000/transactions', { headers }).then(response => setTransactionsData(response.data));
  }, []);

  if (!itemsData || !salesData || !stocksData || !transactionsData) {
    return <div>Loading...</div>;
  }

  const transformItemsData = (data) => ({
    labels: data.map(item => item.Item_Name),
    values: data.map(item => item.Item_Quantity),
  });

  const transformSalesData = (data) => ({
    labels: data.map(sale => new Date(sale.Date).toLocaleDateString()),
    values: data.map(sale => sale.Qty),
  });

  const transformStocksData = (data) => ({
    labels: data.map(stock => new Date(stock.Expiration_date).toLocaleDateString()),
    values: data.map(stock => stock.Quantity),
  });

  const transformTransactionsData = (data) => ({
    labels: data.map(transaction => new Date(transaction.Date).toLocaleDateString()),
    values: data.map(transaction => transaction.Item_Quantity),
  });

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colors;
  };

  const chartData = (data, label) => ({
    labels: data.labels,
    datasets: [{
      label,
      data: data.values,
      backgroundColor: generateColors(data.values.length),
    }],
  });

  const itemsChartData = chartData(transformItemsData(itemsData), 'Items');
  const salesChartData = chartData(transformSalesData(salesData), 'Sales');
  const stocksChartData = chartData(transformStocksData(stocksData), 'Stocks');
  const transactionsChartData = chartData(transformTransactionsData(transactionsData), 'Transactions');

  return (
    <>
    <div className="text-white fixed top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
    <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
      {itemsData.length>0 || salesData.length>0 || stocksData.length>0 || transactionsData.length>0 ? <h1 className='text-center text-white rounded-lg p-4 text-3xl my-4 bg-gray-700'> Welcome To Admin Panel</h1> : <h1 className='text-center text-white rounded-lg p-4 text-3xl my-4 bg-gray-700'> No Data Available</h1>}
      
      {/* <div> */}

      {itemsData.length>0 && <Section className="mt-4" title="Items Overview">
        <GraphContainer>
          <ChartWrapper>
            <Bar data={itemsChartData} />
          </ChartWrapper>
          <ChartWrapper>
            <Pie data={itemsChartData} />
          </ChartWrapper>
        </GraphContainer>
      </Section>}
      {/* </div> */}

      {salesData.length>0 && <Section title="Sales Overview">
        <GraphContainer>
          <ChartWrapper>
            <Line data={salesChartData} />
          </ChartWrapper>
          <ChartWrapper>
            <Pie data={salesChartData} />
          </ChartWrapper>
        </GraphContainer>
      </Section>}

      {stocksData.length>0 && <Section title="Stocks Overview">
        <GraphContainer>
          <ChartWrapper>
            <Bar data={stocksChartData} />
          </ChartWrapper>
          <ChartWrapper>
            <Pie data={stocksChartData} />
          </ChartWrapper>
        </GraphContainer>
      </Section>}

      {transactionsData.length>0 && <Section title="Transactions Overview">
        <GraphContainer>
          <ChartWrapper>
            <Line data={transactionsChartData} />
          </ChartWrapper>
          <ChartWrapper>
            <Pie data={transactionsChartData} />
          </ChartWrapper>
        </GraphContainer>
      </Section>}
    </div>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="w-full mb-10">
    <h2 className="text-2xl font-bold mb-5 text-center text-gray-700">{title}</h2>
    <div className="flex justify-around flex-wrap">{children}</div>
  </div>
);

const GraphContainer = ({ children }) => (
  <div className="flex justify-around flex-wrap w-full">{children}</div>
);

const ChartWrapper = ({ children }) => (
  <div className="w-full md:w-1/2 lg:w-1/3 p-2">
    <div className="bg-white p-4 rounded shadow">
      {children}
    </div>
  </div>
);

export default AdminDashboard;
