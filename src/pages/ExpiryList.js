import React from 'react';

const ExpiryList = ({ rooms = [], threshold }) => {
    const allProducts = rooms.flatMap(room =>
        room.inventory.map(item => ({ ...item, roomId: room.id, floor: room.floor }))
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limitDate = new Date(today.getTime() + threshold * 24 * 60 * 60 * 1000);

    const reportItems = allProducts
        .filter(item => item.expiry && new Date(item.expiry) <= limitDate)
        .sort((a, b) => new Date(a.expiry) - new Date(b.expiry));

    return (
        <div className="page-content fade-in">
            <h2 className="page-title">Контроль: {threshold} дней</h2>
            <div className="expiry-table-container">
                <table className="expiry-table">
                    <thead>
                    <tr>
                        <th>№ Номера</th>
                        <th>Товар</th>
                        <th>Срок</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportItems.map((item, index) => {
                        const isExpired = new Date(item.expiry) < today;
                        return (
                            <tr key={index} className={isExpired ? 'expired' : 'warning'}>
                                <td><b>{item.roomId}</b></td>
                                <td>{item.icon} {item.name}</td>
                                <td>{item.expiry}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {reportItems.length === 0 && <p style={{marginTop: '30px', color: '#999'}}>Критичных сроков не найдено</p>}
            </div>
        </div>
    );
};

export default ExpiryList;