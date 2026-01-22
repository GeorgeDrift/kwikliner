const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.PAYCHANGU_API_URL || 'https://api.paychangu.com';
const SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_KEY}`
    }
});

/**
 * Get supported mobile money operators
 */
exports.getMobileMoneyOperators = async () => {
    try {
        const response = await apiClient.get('/mobile-money');
        return response.data.data || [];
    } catch (error) {
        console.error('PayChangu getOperators Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Initiate a mobile money payment
 */
exports.initiatePayment = async (paymentData) => {
    const crypto = require('crypto');
    try {
        let formattedMobile = paymentData.mobile.replace(/\D/g, '');

        if (formattedMobile.startsWith('265') && formattedMobile.length === 12) {
            formattedMobile = formattedMobile.substring(3);
        }
        else if (formattedMobile.startsWith('0') && formattedMobile.length === 10) {
            formattedMobile = formattedMobile.substring(1);
        }

        const chargeId = paymentData.charge_id || crypto.randomUUID();

        const payload = {
            mobile: formattedMobile,
            amount: paymentData.amount,
            mobile_money_operator_ref_id: paymentData.mobile_money_operator_ref_id,
            charge_id: chargeId
        };

        const response = await apiClient.post('/mobile-money/payments/initialize', payload);
        return { ...response.data, charge_id: chargeId };
    } catch (error) {
        console.error('PayChangu initiatePayment Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Verify a payment
 */
exports.verifyPayment = async (chargeId) => {
    try {
        const response = await apiClient.get(`/mobile-money/payments/${chargeId}/verify`);
        return response.data;
    } catch (error) {
        console.error('PayChangu verifyPayment Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Initiate a payout to a mobile money account
 */
exports.initiatePayout = async (payoutData) => {
    try {
        let formattedMobile = payoutData.mobile.replace(/\D/g, '');

        if (formattedMobile.startsWith('265') && formattedMobile.length === 12) {
            formattedMobile = formattedMobile.substring(3);
        }
        else if (formattedMobile.startsWith('0') && formattedMobile.length === 10) {
            formattedMobile = formattedMobile.substring(1);
        }

        const payload = {
            mobile: formattedMobile,
            amount: payoutData.amount,
            mobile_money_operator_ref_id: payoutData.mobile_money_operator_ref_id,
            charge_id: payoutData.charge_id,
            email: payoutData.email,
            first_name: payoutData.first_name,
            last_name: payoutData.last_name
        };

        const response = await apiClient.post('/mobile-money/payouts/initialize', payload);
        return response.data;
    } catch (error) {
        console.error('PayChangu initiatePayout Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get PayChangu account balance
 */
exports.getAccountBalance = async () => {
    try {
        const response = await apiClient.get('/balance');
        return response.data;
    } catch (error) {
        console.error('PayChangu getAccountBalance Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Get supported banks
 */
exports.getSupportedBanks = async (currency = 'MWK') => {
    try {
        const response = await apiClient.get(`/banks?currency=${currency}`);
        return response.data.data || [];
    } catch (error) {
        console.warn('PayChangu getBanks Error (using fallback):', error.message);
        // Fallback list provided by user (Malawian Banks)
        return [
            { "uuid": "82310dd1-ec9b-4fe7-a32c-2f262ef08681", "name": "National Bank of Malawi" },
            { "uuid": "87e62436-0553-4fb5-a76d-f27d28420c5b", "name": "Ecobank Malawi Limited" },
            { "uuid": "b064172a-8a1b-4f7f-aad7-81b036c46c57", "name": "FDH Bank Limited" },
            { "uuid": "e7447c2c-c147-4907-b194-e087fe8d8585", "name": "Standard Bank Limited" },
            { "uuid": "236760c9-3045-4a01-990e-497b28d115bb", "name": "Centenary Bank" },
            { "uuid": "968ac588-3b1f-4d89-81ff-a3d43a599003", "name": "First Capital Limited" },
            { "uuid": "c759d7b6-ae5c-4a95-814a-79171271897a", "name": "CDH Investment Bank" },
            { "uuid": "86007bf5-1b04-49ba-84c1-9758bbf5c996", "name": "NBS Bank Limited" }
        ];
    }
};

/**
 * Initiate a bank payout
 */
exports.initiateBankPayout = async (payoutData) => {
    try {
        const payload = {
            bank_code: payoutData.bank_code,
            account_number: payoutData.account_number,
            account_name: payoutData.account_name,
            amount: payoutData.amount,
            charge_id: payoutData.charge_id || `TRX-${Date.now()}`,
            email: payoutData.email,
            currency: 'MWK',
            description: 'Withdrawal'
        };

        const response = await apiClient.post('/bank/payouts/initialize', payload);
        return response.data;
    } catch (error) {
        console.error('PayChangu initiateBankPayout Error:', error.response?.data || error.message);
        throw error;
    }
};
