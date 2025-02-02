import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OrderHistory.css';

const API_URL = 'https://your-server-domain.com'; // Замените на ваш домен сервера

const OrderHistory = ({ onReorder }) => {
    const [orders, setOrders] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Загрузка истории заказов пользователя
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/api/orders`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <button 
                className="history-toggle" 
                onClick={() => setIsVisible(!isVisible)}
            >
                📜
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div 
                        className="order-history"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <h3>История заказов</h3>
                        {orders.length === 0 ? (
                            <p>У вас пока нет заказов</p>
                        ) : (
                            orders.map(order => (
                                <motion.div 
                                    className="past-order" 
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <span className="order-date">
                                        {formatDate(order.createdAt)}
                                    </span>
                                    <div className="order-items">
                                        {order.products.map(item => (
                                            <div key={item.id} className="order-item">
                                                {item.name} x{item.quantity || 1}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="order-total">
                                        {order.totalPrice}₽
                                    </span>
                                    <button 
                                        className="reorder-btn"
                                        onClick={() => onReorder(order.products)}
                                    >
                                        🔄 Повторить заказ
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default OrderHistory; 