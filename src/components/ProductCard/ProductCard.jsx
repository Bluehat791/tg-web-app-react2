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
            <img src={product.photoUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Цена: {product.price}₽</p>
            
            {/* Дополнительные ингредиенты */}
            {product.ingredients.length > 0 && (
                <div className="ingredients">
                    <h4>Дополнительно:</h4>
                    {product.ingredients.map(ing => (
                        <label key={ing.id}>
                            <input type="checkbox" />
                            {ing.name} (+{ing.price}₽)
                        </label>
                    ))}
                </div>
            )}
            
            {/* Ингредиенты, которые можно убрать */}
            {product.removableIngredients.length > 0 && (
                <div className="removable">
                    <h4>Убрать:</h4>
                    {product.removableIngredients.map(ing => (
                        <label key={ing.id}>
                            <input type="checkbox" />
                            {ing.name}
                        </label>
                    ))}
                </div>
            )}
            
            <button>Добавить в корзину</button>
        </div>
    );
};

export default ProductCard; 