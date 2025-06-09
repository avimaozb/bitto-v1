import React, { useState, useEffect } from 'react';
import { Server, Networks } from 'stellar-sdk';
import axios from 'axios';
import './MoneyGramIntegration.scss';

const MoneyGramIntegration = () => {
  const [server, setServer] = useState(null);
  const [amount, setAmount] = useState('');
  const [sourceAsset, setSourceAsset] = useState('XLM');
  const [destinationAsset, setDestinationAsset] = useState('USD');
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const stellarServer = new Server('https://horizon.stellar.org');
    setServer(stellarServer);
  }, []);

  const getQuote = async (type) => {
    try {
      setStatus('Getting quote...');
      const response = await axios.post(`/api/sep24/${type}/quote`, {
        source_asset: sourceAsset,
        destination_asset: destinationAsset,
        amount: amount
      });
      setQuote(response.data);
      setStatus('Quote received');
    } catch (error) {
      setStatus(`Error getting quote: ${error.message}`);
    }
  };

  const handleDeposit = async () => {
    try {
      setStatus('Initiating deposit...');
      const response = await axios.post('/api/sep24/deposit/quote', {
        source_asset: sourceAsset,
        destination_asset: destinationAsset,
        amount: amount
      });
      
      setTransactionId(response.data.id);
      setStatus('Please provide your information');
    } catch (error) {
      setStatus(`Error initiating deposit: ${error.message}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      setStatus('Initiating withdrawal...');
      const response = await axios.post('/api/sep24/withdraw/quote', {
        source_asset: sourceAsset,
        destination_asset: destinationAsset,
        amount: amount
      });
      
      setTransactionId(response.data.id);
      setStatus('Please provide payout information');
    } catch (error) {
      setStatus(`Error initiating withdrawal: ${error.message}`);
    }
  };

  const updateTransaction = async () => {
    try {
      setStatus('Updating transaction...');
      const response = await axios.put(`/api/sep24/${transactionId}/update`, {
        user_info: userInfo
      });
      
      setStatus('Transaction updated. Redirecting to MoneyGram...');
      // Redirect to MoneyGram's UI
      window.location.href = response.data.redirect_url;
    } catch (error) {
      setStatus(`Error updating transaction: ${error.message}`);
    }
  };

  return (
    <div className="moneygram-integration">
      <h2>MoneyGram Integration</h2>
      
      <div className="form-group">
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <div className="form-group">
        <label>Source Asset:</label>
        <select
          value={sourceAsset}
          onChange={(e) => setSourceAsset(e.target.value)}
        >
          <option value="XLM">XLM</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div className="form-group">
        <label>Destination Asset:</label>
        <select
          value={destinationAsset}
          onChange={(e) => setDestinationAsset(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {!transactionId ? (
        <div className="buttons">
          <button onClick={handleDeposit}>Deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>
        </div>
      ) : (
        <div className="user-info-form">
          <h3>Please provide your information</h3>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
            />
          </div>
          <button onClick={updateTransaction}>Continue</button>
        </div>
      )}

      {quote && (
        <div className="quote-info">
          <h3>Quote Information</h3>
          <p>Rate: {quote.rate}</p>
          <p>Fee: {quote.fee}</p>
          <p>Total: {quote.total}</p>
        </div>
      )}

      {status && <div className="status">{status}</div>}
    </div>
  );
};

export default MoneyGramIntegration; 