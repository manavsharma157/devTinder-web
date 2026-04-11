import React, { useState } from 'react'; // Added useState import
import axios from 'axios';
import { BASE_URL } from '../utils/constants.js';
import { useEffect } from 'react';


export default function Premium() {
    // Standardized variable name
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
                // Fixed: handler must be a proper function
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

    // Fixed: used !isUserPremium so the pricing shows to non-premium users
    return !isUserPremium ? (
        <div className="min-h-screen bg-[#0f1015] text-white flex flex-col items-center justify-center p-6 font-sans">
            <h1 className="text-4xl font-extrabold mb-10 tracking-wider">PRICING</h1>
            <div className="flex flex-col md:flex-row items-center gap-10">

                {/* Silver Membership Card */}
                <div className="relative group bg-gradient-to-b from-[#232530] to-[#16181f] border border-gray-500 rounded-2xl p-8 w-80 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-[0_0_25px_rgba(156,163,175,0.3)]">
                    <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-500">Silver Membership</h2>
                    <div className="text-3xl font-bold mb-6">₹100/mo</div>
                    <ul className="text-gray-400 space-y-4 mb-8 w-full text-sm">
                        <li className="flex items-center gap-2"><span className="text-gray-300">✓</span> Chat with other people</li>
                        <li className="flex items-center gap-2"><span className="text-gray-300">✓</span> 100 connection Requests per day</li>
                        <li className="flex items-center gap-2"><span className="text-gray-300">✓</span> Blue Tick</li>
                        <li className="flex items-center gap-2"><span className="text-gray-300">✓</span> 3 months</li>
                    </ul>
                    <button onClick={() => handleBuy('silver')} className="w-full bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(156,163,175,0.4)] transition-all">Buy Silver</button>
                </div>

                <span className="text-gray-500 font-bold text-lg hidden md:block">OR</span>

                {/* Gold Membership Card */}
                <div className="relative group bg-gradient-to-b from-[#2a2415] to-[#16181f] border border-yellow-600 rounded-2xl p-8 w-80 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-[0_0_25px_rgba(202,138,4,0.3)]">
                    <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600">Gold Membership</h2>
                    <div className="text-3xl font-bold mb-6 text-yellow-500">₹210/mo</div>
                    <ul className="text-gray-300 space-y-4 mb-8 w-full text-sm">
                        <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Chat with other people</li>
                        <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Infinite connection Requests per day</li>
                        <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> Blue Tick</li>
                        <li className="flex items-center gap-2"><span className="text-yellow-500">✓</span> 6 months</li>
                    </ul>
                    <button onClick={() => handleBuy('gold')} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-black font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(202,138,4,0.4)] transition-all">Buy Gold</button>
                </div>

            </div>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1015] text-white">
            <h1 className="text-2xl">You are already a Premium user</h1>
        </div>
    );
}