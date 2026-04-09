const inventoryTemplate = [
    { name: 'Кола', icon: '🥤', count: 2, expiry: '' },
    { name: 'Пиво', icon: '🍺', count: 2, expiry: '' },
    { name: 'Редбулл', icon: '⚡', count: 1, expiry: '' },
    { name: 'Вино красное', icon: '🍷', count: 1, expiry: 'нет' },
    { name: 'Вино белое', icon: '🥂', count: 1, expiry: 'нет' },
    { name: 'Водка', icon: '🍸', count: 1, expiry: '' },
    { name: 'Виски Jameson', icon: '🥃', count: 1, expiry: '' },
    { name: 'Виски Chivas', icon: '🥃', count: 1, expiry: '' },
    { name: 'Фисташки', icon: '🥜', count: 1, expiry: '' },
    { name: 'Орбит', icon: '🍬', count: 1, expiry: '' },
    { name: 'M&Ms', icon: '🍫', count: 1, expiry: '' },
    { name: 'Сникерс', icon: '🍫', count: 1, expiry: '' },
];

const generateRooms = (floor, start, end) => {
    let rooms = [];
    for (let i = start; i <= end; i++) {
        rooms.push({
            id: floor * 100 + (i - start + 1),
            floor: floor,
            status: 'unchecked',
            inventory: JSON.parse(JSON.stringify(inventoryTemplate)),
            lastDeepCleaning: '',
            notes: ''
        });
    }
    return rooms;
};

export const ALL_ROOMS = [
    ...generateRooms(3, 1, 48),
    ...generateRooms(4, 1, 71),
    ...generateRooms(5, 1, 55)
];

export const INITIAL_USERS = [
    { login: 'admin', pass: '1234', role: 'supervisor' },
    { login: 'staff1', pass: '0000', role: 'staff' }
];