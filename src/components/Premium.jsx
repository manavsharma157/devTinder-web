import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants.js';
import { useEffect } from 'react';


export default function Premium() {
    const [isUserPremium, setUserPremium] = useState(false);
    useEffect(() => {verifyPremiumUser()}, []);


    const verifyPremiumUser = async () => {
        try {
            const res = await axios.get(BASE_URL + '/payment/verify', { withCredentials: true });
            console.log('Payment verification response:', res.data);
            if (res.data.isPremium === true) {
                setUserPremium(true);
            }
        }
        catch (error) {
            console.error('Error verifying payment:', error);
        }
    };

    const handleBuy = async (membershipType) => {
        try {
            const order = await axios.post(
                BASE_URL + '/payment/create',
                { membershipType },
                { withCredentials: true }
            );

            const { amount, keyId, currency, notes, orderId } = order.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: "Dev Tinder",
                description: "Connect to other developers",
                order_id: orderId,
                prefill: {
                    name: notes.firstName + " " + notes.lastName,
                    email: notes.emailId,
                    contact: "9999999999"
                },
                theme: {
                    color: "#F37254",
                },
                
                handler: function (response) {
                    verifyPremiumUser();
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
        }
    };

   
    return !isUserPremium ? (
        <div className="min-h-screen bg-[#0f1015] text-white flex flex-col items-center p-6 font-sans pb-20">
            <h1 className="text-4xl font-extrabold mb-10 mt-10 tracking-wider text-center">
                CHOOSE YOUR PLAN
            </h1>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">

                {/* Silver Membership Card */}
                <div className="relative group bg-gradient-to-b from-[#232530] to-[#0f1015] border border-gray-700 rounded-3xl p-8 w-full max-w-[340px] flex flex-col items-center transition-all hover:border-gray-500 hover:shadow-[0_0_30px_rgba(156,163,175,0.2)]">
                    <div className="absolute -top-4 bg-gray-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">Basic</div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-300">Silver</h2>
                    <div className="text-4xl font-black mb-6">₹100<span className="text-sm text-gray-500 font-normal">/3mo</span></div>
                    
                    <ul className="text-gray-400 space-y-4 mb-8 w-full text-sm border-t border-gray-800 pt-6">
                        <li className="flex items-center gap-3"><span className="text-green-500 font-bold">✓</span> Chat with developers</li>
                        <li className="flex items-center gap-3"><span className="text-green-500 font-bold">✓</span> 100 Requests per day</li>
                        <li className="flex items-center gap-3"><span className="text-green-500 font-bold">✓</span> Standard Blue Tick</li>
                    </ul>
                    
                    <button onClick={() => handleBuy('silver')} className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-2xl transition-all active:scale-95">
                        Get Silver
                    </button>
                </div>

                <div className="hidden lg:block h-20 w-[1px] bg-gray-800"></div>

                {/* Gold Membership Card */}
                <div className="relative group bg-gradient-to-b from-[#2a2415] to-[#0f1015] border border-yellow-700/50 rounded-3xl p-8 w-full max-w-[340px] flex flex-col items-center transition-all hover:border-yellow-500 hover:shadow-[0_0_40px_rgba(202,138,4,0.25)] scale-105 lg:scale-110 z-10">
                    <div className="absolute -top-4 bg-yellow-600 text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
                    <h2 className="text-2xl font-bold mb-2 text-yellow-500">Gold</h2>
                    <div className="text-4xl font-black mb-6 text-yellow-500">₹210<span className="text-sm text-yellow-700 font-normal">/6mo</span></div>
                    
                    <ul className="text-gray-300 space-y-4 mb-8 w-full text-sm border-t border-yellow-900/30 pt-6">
                        <li className="flex items-center gap-3"><span className="text-yellow-500 font-bold">✓</span> Priority Chatting</li>
                        <li className="flex items-center gap-3"><span className="text-yellow-500 font-bold">✓</span> Infinite Requests</li>
                        <li className="flex items-center gap-3"><span className="text-yellow-500 font-bold">✓</span> Premium Blue Tick</li>
                    </ul>
                    
                    <button onClick={() => handleBuy('gold')} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                        Upgrade to Gold
                    </button>
                </div>

            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1015] text-white">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-green-500">✓</span>
            </div>
            <h1 className="text-3xl font-bold">Premium Active</h1>
            <p className="text-gray-500 mt-2">Enjoy your exclusive developer features.</p>
        </div>
    );

}