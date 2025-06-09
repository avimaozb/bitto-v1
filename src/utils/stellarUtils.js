import { Server, Networks, Keypair, TransactionBuilder, Operation } from 'stellar-sdk';

export const createStellarAccount = async () => {
  const keypair = Keypair.random();
  const server = new Server('https://horizon-testnet.stellar.org');

  try {
    // Create account on testnet
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(keypair.publicKey())}`
    );
    const result = await response.json();
    
    if (result.success) {
      return {
        publicKey: keypair.publicKey(),
        secretKey: keypair.secret(),
      };
    }
    throw new Error('Failed to create account');
  } catch (error) {
    console.error('Error creating Stellar account:', error);
    throw error;
  }
};

export const getAccountBalance = async (publicKey) => {
  const server = new Server('https://horizon-testnet.stellar.org');
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances;
  } catch (error) {
    console.error('Error fetching account balance:', error);
    throw error;
  }
};

export const createPaymentTransaction = async (
  sourceSecretKey,
  destinationPublicKey,
  amount,
  asset = 'XLM'
) => {
  const server = new Server('https://horizon-testnet.stellar.org');
  const sourceKeypair = Keypair.fromSecret(sourceSecretKey);

  try {
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: destinationPublicKey,
          asset: asset === 'XLM' ? Asset.native() : new Asset(asset, issuer),
          amount: amount.toString(),
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    
    const result = await server.submitTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Error creating payment transaction:', error);
    throw error;
  }
};

export const parseStellarToml = (tomlData) => {
  // This is a simplified version - in production, you'd want to use a proper TOML parser
  const lines = tomlData.split('\n');
  const result = {};
  
  lines.forEach(line => {
    const [key, value] = line.split('=').map(s => s.trim());
    if (key && value) {
      result[key] = value.replace(/['"]/g, '');
    }
  });
  
  return result;
}; 