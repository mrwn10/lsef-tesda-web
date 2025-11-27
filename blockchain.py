import os
import json
from web3 import Web3
from dotenv import load_dotenv
from web3.exceptions import BadFunctionCallOutput, ContractLogicError

load_dotenv()

ALCHEMY_URL = os.getenv('WEB3_PROVIDER_URI')  # Changed to match your .env
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')

# Check if we have all required environment variables
BLOCKCHAIN_ENABLED = all([ALCHEMY_URL, PRIVATE_KEY, CONTRACT_ADDRESS])

if BLOCKCHAIN_ENABLED:
    try:
        # Validate contract address length first
        if len(CONTRACT_ADDRESS) != 42:
            raise ValueError(f"Invalid contract address length: {len(CONTRACT_ADDRESS)} characters. Should be 42.")
        
        CONTRACT_ADDRESS = Web3.to_checksum_address(CONTRACT_ADDRESS)
        
        # Initialize Web3
        web3 = Web3(Web3.HTTPProvider(ALCHEMY_URL))
        
        # Load ABI
        try:
            with open('contracts/CertificateABI.json') as f:
                abi = json.load(f)
        except FileNotFoundError:
            print("ABI file not found, using mock functions")
            BLOCKCHAIN_ENABLED = False
            abi = []
        
        if BLOCKCHAIN_ENABLED:
            account = web3.eth.account.from_key(PRIVATE_KEY)
            sender_address = account.address
            contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
            
            # Test connection
            if not web3.is_connected():
                raise ConnectionError("Failed to connect to blockchain")
                
            print(f"Blockchain connected: Chain ID {web3.eth.chain_id}")
            print(f"Sender address: {sender_address}")
            
    except Exception as e:
        print(f"Blockchain initialization failed: {e}")
        BLOCKCHAIN_ENABLED = False
else:
    print("Blockchain disabled - missing environment variables")
    web3 = None
    contract = None
    sender_address = None

def get_balance_eth(address):
    if not BLOCKCHAIN_ENABLED or not web3:
        return 0
    try:
        balance_wei = web3.eth.get_balance(address)
        return web3.from_wei(balance_wei, 'ether')
    except Exception as e:
        print(f"Failed to get balance: {e}")
        return 0

def register_certificate(student_name, course, cert_hash):
    if not BLOCKCHAIN_ENABLED:
        print("Blockchain disabled - returning mock transaction hash")
        mock_hash = "0x" + "a" * 64
        print(f"Mock: Registered certificate for {student_name} - {course}")
        return mock_hash
    
    try:
        balance = web3.eth.get_balance(sender_address)
        gas_price = web3.eth.gas_price

        txn_dict = contract.functions.registerCertificate(student_name, course, cert_hash).build_transaction({'from': sender_address})
        txn_data = txn_dict['data']

        gas_estimate = web3.eth.estimate_gas({
            'to': CONTRACT_ADDRESS,
            'from': sender_address,
            'data': txn_data,
        })

        required_eth = gas_estimate * gas_price
        print(f"[Gas] Required ETH: {web3.from_wei(required_eth, 'ether')} | Balance: {web3.from_wei(balance, 'ether')}")

        if balance < required_eth:
            raise Exception("Insufficient funds for gas.")

        nonce = web3.eth.get_transaction_count(sender_address)
        txn = contract.functions.registerCertificate(student_name, course, cert_hash).build_transaction({
            'from': sender_address,
            'nonce': nonce,
            'gas': gas_estimate + 10000,
            'gasPrice': gas_price,
        })

        signed_txn = web3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        tx_hash_hex = web3.to_hex(tx_hash)
        print(f"[TX] Transaction sent: {tx_hash_hex}")

        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        if receipt.status == 1:
            print("[TX] Transaction mined successfully.")
        else:
            print("[TX] Transaction failed.")

        return tx_hash_hex

    except Exception as e:
        print(f"[Error] Failed to register certificate: {str(e)}")
        # Return mock hash for development
        mock_hash = "0x" + "e" * 64
        return mock_hash

def verify_certificate(cert_hash):
    if not BLOCKCHAIN_ENABLED:
        print("Blockchain disabled - returning mock verification")
        return True
    
    try:
        result = contract.functions.verifyCertificate(cert_hash).call()
        print(f"verifyCertificate result: {result}")
        return result
    except ContractLogicError as e:
        print(f"Contract reverted during verification: {e}")
        return False
    except Exception as e:
        print(f"Contract call failed with exception: {e}")
        return False