import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const DebugMarketplace = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [data, setData] = useState<any>({ cargo: [], products: [], vehicles: [] });
    const [error, setError] = useState<string>('');

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    useEffect(() => {
        const runDebug = async () => {
            try {
                addLog('Starting fetch...');
                const cargo = await api.getPublicCargoListings();
                addLog(`Cargo fetched: ${cargo?.length || 0} items`);

                const products = await api.getPublicProducts();
                addLog(`Products fetched: ${products?.length || 0} items`);

                const vehicles = await api.getPublicVehicleListings();
                addLog(`Vehicles fetched: ${vehicles?.length || 0} items`);

                setData({ cargo, products, vehicles });
            } catch (err: any) {
                addLog(`ERROR: ${err.message}`);
                setError(err.message);
            }
        };

        runDebug();
    }, []);

    return (
        <div className="p-10 bg-white min-h-screen text-slate-900 font-mono">
            <h1 className="text-3xl font-bold mb-5">Marketplace Debugger</h1>

            <div className="mb-8 p-4 bg-slate-100 rounded">
                <h3 className="font-bold border-b border-slate-300 pb-2 mb-2">System Info</h3>
                <p>Host: {window.location.hostname}</p>
                <p>Protocol: {window.location.protocol}</p>
            </div>

            <div className="mb-8 p-4 bg-yellow-50 rounded border border-yellow-200">
                <h3 className="font-bold border-b border-yellow-300 pb-2 mb-2">Logs</h3>
                {logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-100 text-red-700 rounded border border-red-300">
                    <strong>CRITICAL ERROR:</strong> {error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded">
                    <strong>Cargo ({data.cargo?.length})</strong>
                    <pre className="text-xs mt-2 overflow-auto h-40">{JSON.stringify(data.cargo?.[0], null, 2)}</pre>
                </div>
                <div className="p-4 border rounded">
                    <strong>Products ({data.products?.length})</strong>
                    <pre className="text-xs mt-2 overflow-auto h-40">{JSON.stringify(data.products?.[0], null, 2)}</pre>
                </div>
                <div className="p-4 border rounded">
                    <strong>Vehicles ({data.vehicles?.length})</strong>
                    <pre className="text-xs mt-2 overflow-auto h-40">{JSON.stringify(data.vehicles?.[0], null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default DebugMarketplace;
