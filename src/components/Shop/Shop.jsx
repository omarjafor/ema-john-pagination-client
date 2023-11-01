import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const cartProduct = useLoaderData();
    const [cart, setCart] = useState(cartProduct)

    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(0);
    const [count, setCount] = useState(0);
    const numberOfPages = Math.ceil(count / itemsPerPage);
    
    useEffect( () => {
        fetch('http://localhost:5000/productCount')
        .then(res => res.json())
        .then(data => setCount(data.count))
    } , [])

    // const pages = []
    // for(let i = 0; i < numberOfPages; i++){
    //     pages.push(i)
    // }

    const pages = [ ...Array(numberOfPages).keys()]

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemsPerPage]);

    

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemsPerPage = e => {
        const val = parseInt(e.target.value);
        setItemsPerPage(val);
        setCurrentPage(0);
    }

    const handlePrevPage = () => {
        if( currentPage > 0){
            setCurrentPage( currentPage - 1 )
        }
    }

    const handleNextPage = () => {
        if( currentPage < pages.length - 1 ){
            setCurrentPage( currentPage + 1 )
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <p>Current Page : {currentPage}</p>
                <button onClick={handlePrevPage}>Prev</button>
                {
                    pages.map( page => <button className={currentPage === page ? 'selected' : undefined }
                        onClick={() => setCurrentPage(page)}
                        key={page}>{page}</button>)
                }
                <button onClick={handleNextPage}>Next</button>
                <select value={itemsPerPage} onChange={handleItemsPerPage} name="" id="" className=''>
                    <option value="9">9</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;