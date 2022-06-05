import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';

import { contractABI,contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI, signer);

return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData,setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setisLoading] = useState(false);
    const [transactionCount, settransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([])

    const handleChange = (e, name)=> {
           setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }
  
    const getAllTransactions = async() => {
        try {
            if (ethereum) {
                const transactionsContract = createEthereumContract();
        
                const availableTransactions = await transactionsContract.getAllTransactions();
        
                const structuredTransactions = availableTransactions.map((transaction) => ({
                  addressTo: transaction.reciever,
                  addressFrom: transaction.sender,
                  timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                  message: transaction.message,
                  keyword: transaction.keyword,
                  amount: parseInt(transaction.amount._hex) / (10 ** 18)
                }));
        
                console.log(structuredTransactions);
        
                setTransactions(structuredTransactions);
              } else {
                console.log("Ethereum is not present");
              }
        } catch (error) {
            console.log(error)
        }
    }
    const wallet = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({method: 'eth_accounts'});
    
            if(accounts.length) {
                setCurrentAccount(accounts[0]);
    
                getAllTransactions();
            }else {
                console.log("No Account Found!!");
            }
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Object!!");
        }

    }

    const existingTransactions = async() => {
        try {
            if (ethereum) {
                const transactionsContract = createEthereumContract();
                const currentTransactionCount = await transactionsContract.getTransactionCount();
        
                window.localStorage.setItem("transactionCount", currentTransactionCount);
              }
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Objecct!!");
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            const accounts = await ethereum.request({method: 'eth_requestAccounts',});

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Objecct!!");
        }
    }

    const sendTransactions = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            //get data from the form
            const {addressTo, amount, keyword,message} = formData;
            const transactionContract = createEthereumContract();
            const parsedAmount= ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 GWEI or 0.000021 eth
                    value: parsedAmount._hex, //0.00001
                }],
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setisLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setisLoading(false);
             
            const transactionCount = await transactionContract.getTransactionCount();
            settransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum Objecct!!");
        }
    }
    useEffect(() => {
       wallet();
       existingTransactions();
    }, [transactionCount])
    
    return(
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, handleChange,sendTransactions,transactions,isLoading,transactionCount}}>
            {children}
        </TransactionContext.Provider>
    )
}