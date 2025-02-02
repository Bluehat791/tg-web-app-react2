import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelegram } from '../hooks/useTelegram';
import './ProductCard.css';

const ProductCard = ({ product, isAdmin, onDelete, onAddToCart }) => {
    const { tg } = useTelegram();
    const [showIngredients, setShowIngredients] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [removedIngredients, setRemovedIngredients] = useState([]);
    const [isAdded, setIsAdded] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const toggleIngredient = (ingredient) => {
        if (selectedIngredients.find(i => i.id === ingredient.id)) {
            setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredient.id));
        } else {
            setSelectedIngredients([...selectedIngredients, ingredient]);
        }
    };

    const toggleRemoveIngredient = (ingredient) => {
        if (removedIngredients.find(i => i.id === ingredient.id)) {
            setRemovedIngredients(removedIngredients.filter(i => i.id !== ingredient.id));
        } else {
            setRemovedIngredients([...removedIngredients, ingredient]);
        }
    };

    const calculateTotalPrice = () => {
        const additionsPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
        return product.price + additionsPrice;
    };

    const handleAddToCart = () => {
        const finalProduct = {
            ...product,
            finalPrice: calculateTotalPrice(),
            addedIngredients: selectedIngredients,
            removedIngredients: removedIngredients
        };
        
        setIsAdded(true);
        onAddToCart(finalProduct);
        
        // Сброс анимации
        setTimeout(() => setIsAdded(false), 300);
    };

    const handleShare = () => {
        if (tg && tg.shareUrl) {
            tg.shareUrl(`Попробуй ${product.name}!`);
        }
    };

    console.log('Product data:', product);
    console.log('Removable ingredients:', product.removable_ingredients);

    return (
        <motion.div 
            className="product-card"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {product.popular && (
                <motion.span 
                    className="popular-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    🔥 Популярное
                </motion.span>
            )}
            
            <div className="image-container">
                <img 
                    src={product.photo_url || 'placeholder.jpg'} 
                    alt={product.name} 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'placeholder.jpg';
                    }}
                />
                <div className="image-overlay">
                    <button 
                        className="details-btn"
                        onClick={() => setShowDetails(true)}
                    >
                        Подробнее
                    </button>
                </div>
            </div>

            <div className="product-content">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <motion.div 
                    className="price"
                    whileHover={{ scale: 1.05 }}
                >
                    {calculateTotalPrice()}₽
                </motion.div>
                
                <AnimatePresence>
                    {showDetails && (
                        <motion.div 
                            className="details-modal"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                        >
                            <button 
                                className="close-btn"
                                onClick={() => setShowDetails(false)}
                            >
                                ✕
                            </button>
                            
                            {/* Ингредиенты */}
                            <div className="ingredients-section">
                                <h4>Дополнительно:</h4>
                                <div className="ingredients">
                                    {product.ingredients?.map(ing => (
                                        <label key={ing.id}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIngredients.some(i => i.id === ing.id)}
                                                onChange={() => toggleIngredient(ing)}
                                            />
                                            {ing.name} (+{ing.price} ₽)
                                        </label>
                                    ))}

                                    {product.removable_ingredients?.map(ing => (
                                        <label key={ing.id}>
                                            <input
                                                type="checkbox"
                                                checked={removedIngredients.some(i => i.id === ing.id)}
                                                onChange={() => toggleRemoveIngredient(ing)}
                                            />
                                            Убрать {ing.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Дополнительная информация */}
                            <div className="additional-info">
                                <span className="calories">🔥 {product.calories || '300'} ккал</span>
                                <div className="cooking-info">
                                    <span className="cooking-time">⏱️ {product.cookingTime || '15-20'} мин</span>
                                    {product.isPreparingNow && (
                                        <span className="preparing-now">👨‍🍳 Готовится</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <motion.button 
                    className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.95 }}
                >
                    {isAdded ? '✓ Добавлено' : 'Добавить в корзину'}
                </motion.button>

                {isAdmin && (
                    <button onClick={() => onDelete(product.id)} className="delete-btn">
                        Удалить
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard; 