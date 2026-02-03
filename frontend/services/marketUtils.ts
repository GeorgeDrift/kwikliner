import { MarketItem } from '../types';

export const mapMarketItem = (item: any): MarketItem => {
    const meta = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : (item.metadata || {});

    // Ensure we handle both direct API items and socket items
    return {
        id: item.id || item.external_id,
        name: item.title || item.name || 'Untitled Item',
        cat: item.type || item.cat || 'Hardware',
        type: item.type || item.cat || 'Hardware', // Added to satisfy MarketItem interface
        price: Number(item.price) || 0,
        priceStr: item.price_str || (item.price ? `MWK ${Number(item.price).toLocaleString()}` : 'Negotiable'),
        img: (item.images && item.images[0]) || item.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
        images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
        location: item.location || 'Malawi',
        provider: item.provider_name || item.provider || item.seller || 'Verified Seller',
        details: item.description || item.details || 'No description available.',
        weight: meta.weight || item.weight,
        quantity: meta.quantity || item.quantity,
        capacity: meta.capacity || item.capacity || meta.capacity,
        manufacturer: meta.manufacturer || item.manufacturer,
        model: meta.model || item.model,
        vehicleType: meta.vehicle_type || meta.vehicleType || item.vehicle_type,
        operatingRange: meta.operating_range || meta.operatingRange || item.operating_range,
        driverId: item.driver_id || item.ownerId || item.seller_id,
        ownerId: item.ownerId || item.seller_id || item.driver_id
    };
};

export const mapMarketData = (data: any[]) => {
    if (!Array.isArray(data)) return [];
    return data.map(mapMarketItem);
};
