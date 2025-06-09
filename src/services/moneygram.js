import { Server, Networks, TransactionBuilder, Operation } from 'stellar-sdk';
import axios from 'axios';

export class MoneyGramService {
  constructor() {
    this.server = new Server('https://horizon.stellar.org');
    this.moneygramApi = axios.create({
      baseURL: process.env.MONEYGRAM_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.MONEYGRAM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getDepositQuote(sourceAsset, destinationAsset, amount) {
    try {
      const response = await this.moneygramApi.post('/quotes/deposit', {
        source_asset: sourceAsset,
        destination_asset: destinationAsset,
        amount: amount
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get deposit quote: ${error.message}`);
    }
  }

  async updateDeposit(id, userInfo) {
    try {
      const response = await this.moneygramApi.put(`/deposits/${id}`, {
        user_info: userInfo
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update deposit: ${error.message}`);
    }
  }

  async commitDeposit(id) {
    try {
      const response = await this.moneygramApi.put(`/deposits/${id}/commit`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to commit deposit: ${error.message}`);
    }
  }

  async getWithdrawQuote(sourceAsset, destinationAsset, amount) {
    try {
      const response = await this.moneygramApi.post('/quotes/withdraw', {
        source_asset: sourceAsset,
        destination_asset: destinationAsset,
        amount: amount
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get withdrawal quote: ${error.message}`);
    }
  }

  async updateWithdraw(id, payoutInfo) {
    try {
      const response = await this.moneygramApi.put(`/withdrawals/${id}`, {
        payout_info: payoutInfo
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update withdrawal: ${error.message}`);
    }
  }

  async commitWithdraw(id) {
    try {
      const response = await this.moneygramApi.put(`/withdrawals/${id}/commit`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to commit withdrawal: ${error.message}`);
    }
  }

  async handleTransactionUpdate(transactionId, status, message) {
    try {
      // Update local transaction status
      await this.updateTransactionStatus(transactionId, status);
      
      // Notify user if needed
      if (status === 'completed' || status === 'failed') {
        await this.notifyUser(transactionId, status, message);
      }
      
      return true;
    } catch (error) {
      throw new Error(`Failed to handle transaction update: ${error.message}`);
    }
  }

  async updateTransactionStatus(transactionId, status) {
    // Implement your database update logic here
    console.log(`Updating transaction ${transactionId} to status: ${status}`);
  }

  async notifyUser(transactionId, status, message) {
    // Implement your user notification logic here
    console.log(`Notifying user about transaction ${transactionId}: ${status} - ${message}`);
  }
} 