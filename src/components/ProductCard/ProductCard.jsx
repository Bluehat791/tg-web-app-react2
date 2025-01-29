import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [removedIngredients, setRemovedIngredients] = useState([]);
    const [showIngredients, setShowIngredients] = useState(false);

    const toggleIngredient = (ingredient) => {
        setSelectedIngredients(prev => {
            if (prev.find(i => i.id === ingredient.id)) {
                return prev.filter(i => i.id !== ingredient.id);
            }
            return [...prev, ingredient];
        });
    };

    const toggleRemoveIngredient = (ingredient) => {
        setRemovedIngredients(prev => {
            if (prev.find(i => i.id === ingredient.id)) {
                return prev.filter(i => i.id !== ingredient.id);
            }
            return [...prev, ingredient];
        });
    };

    const calculateTotalPrice = () => {
        const basePrice = product.price;
        const additionsPrice = selectedIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
        return basePrice + additionsPrice;
    };

    console.log('Product data:', product);
    console.log('Removable ingredients:', product.removableIngredients);

    return (
        <div className="product-card">
            {product.photoUrl ? (
                <img src={product.photoUrl} alt={product.name} />
            ) : (
                <div className="no-image">Нет фото</div>
            )}
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <p className="price">{calculateTotalPrice()} ₽</p>

                {(Array.isArray(product.ingredients) && product.ingredients.length > 0 || 
                 Array.isArray(product.removableIngredients) && product.removableIngredients.length > 0) && (
                    <button 
                        className="ingredients-toggle"
                        onClick={() => setShowIngredients(!showIngredients)}
                    >
                        {showIngredients ? 'Скрыть состав' : 'Показать состав'}
                    </button>
                )}

                {showIngredients && (
                    <div className="ingredients-section">
                        {Array.isArray(product.removableIngredients) && 
                         product.removableIngredients.length > 0 && (
                            <div className="removable-ingredients">
                                <h4>Убрать из состава:</h4>
                                {product.removableIngredients.map(ing => (
                                    <label key={ing.id} className="ingredient-item removable">
                                        <input
                                            type="checkbox"
                                            checked={removedIngredients.some(i => i.id === ing.id)}
                                            onChange={() => toggleRemoveIngredient(ing)}
                                        />
                                        {ing.name}
                                    </label>
                                ))}
                            </div>
                        )}

                        {Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
                            <div className="additional-ingredients">
                                <h4>Добавить в состав:</h4>
                                {product.ingredients.map(ing => (
                                    <label key={ing.id} className="ingredient-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedIngredients.some(i => i.id === ing.id)}
                                            onChange={() => toggleIngredient(ing)}
                                        />
                                        {ing.name} (+{ing.price}₽)
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button 
                    className="add-to-cart"
                    onClick={() => onAddToCart({
                        ...product,
                        finalPrice: calculateTotalPrice(),
                        addedIngredients: selectedIngredients,
                        removedIngredients: removedIngredients
                    })}
                >
                    В корзину
                </button>
            </div>
        </div>
    );
};

export default ProductCard; 