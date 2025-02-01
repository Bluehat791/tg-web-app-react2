import React, { useState, useEffect } from 'react';
import './ProductList.css';
import ProductCard from '../ProductCard/ProductCard';
import OrderModal from '../OrderModal/OrderModal';
import { useTelegram } from '../hooks/useTelegram';
import { motion } from 'framer-motion';
import Cart from '../Cart/Cart';
import OrderHistory from '../OrderHistory/OrderHistory';

const ProductList = () => {
    const [products, setProducts] = useState({
        snacks: [],
        mainMenu: [],
        drinks: [],
        sauces: []
    });
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const { tg, user } = useTelegram();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState('default');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTags, setActiveTags] = useState([]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const getCategoryTitle = (category) => {
        const titles = {
            snacks: '🍟 Снеки',
            mainMenu: '🍴 Основное меню',
            drinks: '🥤 Напитки',
            sauces: '🥫 Соусы'
        };
        return titles[category] || category;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/products');
            const data = await response.json();
            console.log('Received products:', data);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
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
        
        console.log('Submitting order with data:', {
            products: cart,
            totalPrice,
            ...orderData,
            userId: user?.id
        });

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

            const result = await response.json();
            console.log('Order submission result:', result);

            if (response.ok) {
                setIsModalOpen(false);
                setCart([]);
                tg.MainButton.hide();
                
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

    const handleRemoveFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
        updateMainButton();
    };

    const handleUpdateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prev => prev.map((item, i) => 
            i === index ? { ...item, quantity: newQuantity } : item
        ));
        updateMainButton();
    };

    const toggleTag = (tag) => {
        if (activeTags.includes(tag)) {
            setActiveTags(prev => prev.filter(t => t !== tag));
        } else {
            setActiveTags(prev => [...prev, tag]);
        }
    };

    const getTimeBasedProducts = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 11) {
            return <div className="time-suggestion">🌅 Идеально для завтрака</div>;
        } else if (hour >= 11 && hour < 16) {
            return <div className="time-suggestion">🌞 Время обеда</div>;
        } else if (hour >= 16 && hour < 22) {
            return <div className="time-suggestion">🌆 Отличный ужин</div>;
        }
        return <div className="time-suggestion">🌙 Ночной перекус</div>;
    };

    const getRecommendations = (currentProduct) => {
        return products.filter(p => 
            p.category === currentProduct.category && 
            p.id !== currentProduct.id
        ).slice(0, 3);
    };

    const handleReorder = (products) => {
        products.forEach(product => {
            handleAddToCart(product);
        });
    };

    return (
        <div className="product-list-container">
            <header className="product-list-header">
                <div className="user-info">
                    <img 
                        src={user?.photo_url || '/default-avatar.png'} 
                        alt="User" 
                        className="user-avatar"
                    />
                    <span className="username">{user?.username || 'Гость'}</span>
                </div>
                <div className="cart-info" onClick={() => setIsCartOpen(true)}>
                    {cart.length > 0 && (
                        <span className="cart-count">{cart.length}</span>
                    )}
                    <span className="cart-icon">🛒</span>
                </div>
            </header>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Поиск блюд..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="quick-filters">
                <div 
                    className={`filter-tag ${activeTags.includes('popular') ? 'active' : ''}`}
                    onClick={() => toggleTag('popular')}
                >
                    🔥 Популярное
                </div>
                <div 
                    className={`filter-tag ${activeTags.includes('spicy') ? 'active' : ''}`}
                    onClick={() => toggleTag('spicy')}
                >
                    🌶️ Острое
                </div>
                <div 
                    className={`filter-tag ${activeTags.includes('new') ? 'active' : ''}`}
                    onClick={() => toggleTag('new')}
                >
                    🆕 Новинки
                </div>
            </div>

            <div className="sort-controls">
                <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                    <option value="default">По умолчанию</option>
                    <option value="priceAsc">Сначала дешевле</option>
                    <option value="priceDesc">Сначала дороже</option>
                    <option value="nameAsc">По названию А-Я</option>
                </select>
            </div>

            <nav className="category-nav">
                <button 
                    className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                >
                    Все
                </button>
                <button 
                    className={`category-btn ${activeCategory === 'snacks' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('snacks')}
                >
                    🍟 Снеки
                </button>
                <button 
                    className={`category-btn ${activeCategory === 'mainMenu' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('mainMenu')}
                >
                    🍴 Основное меню
                </button>
                <button 
                    className={`category-btn ${activeCategory === 'drinks' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('drinks')}
                >
                    🍹 Напитки
                </button>
                <button 
                    className={`category-btn ${activeCategory === 'sauces' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('sauces')}
                >
                    🍴 Соусы
                </button>
            </nav>

            <motion.div 
                className="products-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {isLoading ? (
                    <div className="loading-skeleton">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="skeleton-card" />
                        ))}
                    </div>
                ) : (
                    Object.entries(products).map(([category, items]) => {
                        const filteredItems = items.filter(item => 
                            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        
                        return (activeCategory === 'all' || activeCategory === category) && (
                            <motion.section 
                                key={category}
                                variants={itemVariants}
                            >
                                <h2>{getCategoryTitle(category)}</h2>
                                <div className="products-grid">
                                    {filteredItems.map(product => (
                                        <ProductCard 
                                            key={product.id}
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                        />
                                    ))}
                                </div>
                            </motion.section>
                        );
                    })
                )}
            </motion.div>

            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleOrderSubmit}
                totalPrice={cart.reduce((sum, item) => sum + item.finalPrice, 0)}
                cart={cart}
                user={user}
            />

            <Cart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                onRemoveItem={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
            />

            <OrderHistory onReorder={handleReorder} />
        </div>
    );
};

export default ProductList;