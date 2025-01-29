import React, { useState, useEffect } from 'react';
import './ProductList.css';
import ProductCard from '../ProductCard/ProductCard';
import OrderModal from '../OrderModal/OrderModal';
import { useTelegram } from '../hooks/useTelegram';

const ProductList = () => {
    const [products, setProducts] = useState({
        snacks: [],
        mainMenu: [],
        drinks: [],
        sauces: []
    });
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { tg, user } = useTelegram();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/products');
            const data = await response.json();
            console.log('Received products:', data);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddToCart = (product) => {
        setCart(prev => [...prev, product]);
        updateMainButton();
    };

    const updateMainButton = () => {
        const totalPrice = cart.reduce((sum, item) => sum + item.finalPrice, 0);
        if (cart.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Заказать • ${totalPrice}₽`
            });
            tg.MainButton.onClick(() => setIsModalOpen(true));
        }
    };

    const handleOrderSubmit = async (orderData) => {
        const totalPrice = cart.reduce((sum, item) => sum + item.finalPrice, 0);
        
        try {
            const response = await fetch('http://localhost:8000/web-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: cart,
                    totalPrice,
                    ...orderData,
                    userId: user?.id
                }),
            });

            if (response.ok) {
                setIsModalOpen(false);
                setCart([]);
                tg.MainButton.hide();
                
                // Показываем сообщение о времени ожидания
                const message = orderData.deliveryType === 'pickup' 
                    ? 'Можете забирать заказ через 15 минут'
                    : 'Доставщик будет в течении часа';
                    
                tg.showPopup({
                    title: 'Заказ принят',
                    message: message,
                    buttons: [{type: 'ok'}]
                });
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            tg.showPopup({
                title: 'Ошибка',
                message: 'Произошла ошибка при оформлении заказа',
                buttons: [{type: 'ok'}]
            });
        }
    };

    return (
        <div className="product-list">
            <section>
                <h2>Снеки</h2>
                <div className="products-grid">
                    {products.snacks.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2>Основное меню</h2>
                <div className="products-grid">
                    {products.mainMenu.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2>Напитки</h2>
                <div className="products-grid">
                    {products.drinks.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2>Соусы</h2>
                <div className="products-grid">
                    {products.sauces.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </section>

            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleOrderSubmit}
                totalPrice={cart.reduce((sum, item) => sum + item.finalPrice, 0)}
            />
        </div>
    );
};

export default ProductList;