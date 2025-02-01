import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Cart.css';

const Cart = ({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity }) => {
    const total = items.reduce((sum, item) => sum + item.finalPrice * (item.quantity || 1), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        className="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div 
                        className="cart-modal"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                    >
                        <div className="cart-header">
                            <h3>Корзина</h3>
                            <button className="close-btn" onClick={onClose}>✕</button>
                        </div>

                        {items.length === 0 ? (
                            <div className="cart-empty">
                                <span className="cart-empty-icon">🛒</span>
                                <p>Корзина пуста</p>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {items.map((item, index) => (
                                        <motion.div 
                                            key={index}
                                            className="cart-item"
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <img src={item.photoUrl} alt={item.name} />
                                            <div className="item-details">
                                                <h4>{item.name}</h4>
                                                <div className="item-customization">
                                                    {item.addedIngredients?.length > 0 && (
                                                        <small>
                                                            Добавки: {item.addedIngredients.map(i => i.name).join(', ')}
                                                        </small>
                                                    )}
                                                    {item.removedIngredients?.length > 0 && (
                                                        <small>
                                                            Убрать: {item.removedIngredients.map(i => i.name).join(', ')}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="item-price">
                                                    {item.finalPrice}₽
                                                </div>
                                            </div>
                                            <div className="item-controls">
                                                <button 
                                                    className="quantity-btn"
                                                    onClick={() => onUpdateQuantity(index, (item.quantity || 1) - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="quantity">{item.quantity || 1}</span>
                                                <button 
                                                    className="quantity-btn"
                                                    onClick={() => onUpdateQuantity(index, (item.quantity || 1) + 1)}
                                                >
                                                    +
                                                </button>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => onRemoveItem(index)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="cart-footer">
                                    <div className="cart-total">
                                        <span>Итого:</span>
                                        <span className="total-price">{total}₽</span>
                                    </div>
                                    <button 
                                        className="checkout-btn"
                                        onClick={() => {
                                            onClose();
                                            // Здесь будет открываться модальное окно оформления заказа
                                        }}
                                    >
                                        Оформить заказ
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart; 