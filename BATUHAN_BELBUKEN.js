(() => {
    if (!window.location.pathname.endsWith('/')) {
        console.log('wrong page');
        return;
    }

    const init = async () => {
        try {
            const products = await loadProducts();
            buildCSS();
            buildHTML(products);
            setEvents();
            getLocalFavs();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const loadProducts = async () => {
        const cached = localStorage.getItem('ebebek-urunler');
        if (cached) {
            const products = JSON.parse(cached);
            return products;
        }
        try {
            const response = await fetch(
                'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json'
            );
            const products = await response.json();
            localStorage.setItem('ebebek-urunler', JSON.stringify(products));
            return products;
        } catch (error) {
            console.error('Error while fetching:', error);
        }
    };

    const getLocalFavs = () => {
        const cached =
            JSON.parse(localStorage.getItem('ebebek-local-favoriler')) || [];
        document.querySelectorAll('.ebebek-favoriler').forEach((btn) => {
            btn.innerHTML = cached.includes(btn.dataset.id) ? '🧡' : '♡';
        });
    };

    const buildHTML = (products) => {
        const container = document.createElement('div');
        container.className = 'container';

        const titleDiv = document.createElement('h2');
        titleDiv.className = 'carousel-title';
        container.appendChild(titleDiv);

        const title = document.createElement('span');
        title.textContent = 'Beğenebileceğinizi düşündüklerimiz';
        title.style.marginLeft = '38px';
        titleDiv.appendChild(title);

        const carousel = document.createElement('div');
        carousel.className = 'carousel';
        container.appendChild(carousel);

        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-prev';
        prevBtn.innerHTML = '<';
        carousel.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-next';
        nextBtn.innerHTML = '>';
        carousel.appendChild(nextBtn);

        const productsContainer = document.createElement('div');
        productsContainer.className = 'products-container';
        carousel.appendChild(productsContainer);

        products.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;

            const productLink = document.createElement('a');
            productLink.href = product.url;
            productLink.target = '_blank';
            productCard.appendChild(productLink);

            const productImg = document.createElement('img');
            productImg.src = product.img;
            productImg.alt = product.name;
            productImg.className = 'product-card-image';
            productLink.appendChild(productImg);

            const productName = document.createElement('h3');
            productName.className = 'product-card-name';
            productName.textContent = product.name;
            productLink.appendChild(productName);

            const priceContainer = document.createElement('div');
            priceContainer.className = 'product-price-container';
            productCard.appendChild(priceContainer);

            const currentPrice = document.createElement('span');
            currentPrice.className = 'product-price-current';
            currentPrice.textContent = `${product.price} TL`;
            priceContainer.appendChild(currentPrice);

            const sepeteEkle = document.createElement('button');
            sepeteEkle.className = 'add-to-cart';
            sepeteEkle.textContent = 'Sepete Ekle';
            productCard.appendChild(sepeteEkle);

            let oldPrice, discountDiv;

            if (
                product.original_price &&
                product.original_price !== product.price
            ) {
                currentPrice.className = 'product-price-current-discount';
                oldPrice = document.createElement('span');
                oldPrice.className = 'old-price';
                oldPrice.textContent = `${product.original_price} TL`;

                const discount = Math.round(
                    (1 - product.price / product.original_price) * 100
                );

                discountDiv = document.createElement('span');
                discountDiv.className = 'carousel-discount';
                discountDiv.textContent = `%${discount} indirim`;

                priceContainer.appendChild(oldPrice);
                priceContainer.appendChild(discountDiv);
            }

            const favButton = document.createElement('button');
            favButton.className = 'ebebek-favoriler';
            favButton.dataset.id = product.id;
            productCard.appendChild(favButton);

            productsContainer.appendChild(productCard);
        });

        const storiesSection =
            document.querySelector('.stories-section') ||
            document.querySelector('.stories') ||
            document.querySelector('.Section1');

        if (storiesSection) {
            storiesSection.insertAdjacentElement('afterend', container);
        } else {
            document.body.insertAdjacentElement('afterbegin', container);
        }
    };

    const buildCSS = () => {
        const fontLink = document.createElement('link');
        fontLink.href =
            'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        const fontLink2 = document.createElement('link');
        fontLink2.href =
            'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
        fontLink2.rel = 'stylesheet';
        document.head.appendChild(fontLink2);

        const style = document.createElement('style');
        style.textContent = `
            body {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: 'Quicksand', 'Gill Sans', sans-serif;
            }

            .container {
                box-sizing: border-box;
                width: 100%;
                max-width: 1290px;
                margin: 0 auto;
                margin-top: 20px;
                border-radius: 30px;
                box-shadow: 0 5px 5px -5px rgba(0,0,0,0.1);
            }
            
            .carousel-title {
                
                font-size: 3.1rem;
                font-weight: bold;
                color: #f28e00;
                background-color: #fef6eb;
                padding: 22px 30px;
                margin: 0 0 5px 0;
                border-radius: 30px 30px 0 0;
                
            }
            
            .carousel {
                position: relative;
            }
            
            .products-container {
                display: flex;
                gap: 15px;
                overflow-x: auto;
                padding: 20px 5px;
                scrollbar-width: none;
            }
            
            .product-card {
                font-family: Georgia, 'Times New Roman', Times, serif;
                background-color: #fff;
                flex: 0 0 auto;
                width: 19%; 
                min-height: 380px; 
                border: 1px solid #eee;
                border-radius: 10px;
                padding: 20px;
                position: relative;
                transition: transform 0.3s;
                text-decoration: none;
                display: flex; 
                flex-direction: column; 
            }
            
            .product-card:hover {
                outline: 3px solid  #f28e00;
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .product-card a {
                text-decoration: none;
            }
                

            .product-card-image {
                width: 100%;
                height: 200px;
                object-fit: contain;
                margin-bottom: 15px;
            }
            
            .product-card-name {
                font-family: 'Poppins', cursive, sans-serif;
                font-size: 12px;
                margin: 0 0 10px 0;
                color: #7d7d7d;
                height: auto;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            
            .product-price-container {
                font-family: 'Poppins', cursive, sans-serif;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .product-price-current {
                font-weight: bold;
                color: #7d7d7d;
                font-size: 16px;
            }

            .product-price-current-discount {
                font-weight: bold;
                color: #00a365;
                font-size: 16px;
            }
            
            .old-price {
                text-decoration: line-through;
                color: #999;
                font-size: 14px;
            }
            
            .carousel-discount {
                background-color: #00a365;
                color: white;
                padding: 2px 5px;
                border-radius: 4px;
                font-size: 12px;
                align-self: flex-start;
                margin-bottom: 70px;

            }

            .add-to-cart {
                background-color: #fef6eb;
                color: #f28e00;
                border: none;
                border-radius: 20px;
                padding: 10px 15px;
                cursor: pointer;
                font-family: 'Poppins', sans-serif;
                font-weight: 600;
                font-size: 14px;
                width: 90%;
                max-width: 200px; 
                margin: 10px auto 0;
                display: block;
                transition: all 0.3s ease;
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .add-to-cart:hover {
                background-color: #e07d00;
                color: white;   
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            .ebebek-favoriler {
                position: absolute;
                line-height: 1;
                top: 15px;
                right: 15px;
                background: white;
                color: #f28e00;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 25px !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .carousel-prev,
            .carousel-next {
                position: absolute;
                background-color: #fef6eb;
                color: #f28e00;
                font-weight: bold;
                top: 45%;
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 100%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                cursor: pointer;
                z-index: 1;
                font-size: 28px;
                transition: transform 0.3s;

            }
            
            .carousel-prev {
                left: -63px;
            }
            
            .carousel-next {
                right: -63px;
            }

            .carousel-prev:hover,
            .carousel-next:hover {
            background-color: white;
            outline: 1px solid  #f28e00;
            transform: scale(1.1);
            }
            
            @media (max-width: 768px) {
                .container {
                    width: 100%; 
                    padding: 0 10px;
                }

                
                .product-card {
                    width: 160px; 
                    min-width: 240px; 
                    padding: 15px; 
                    border-radius: 10px;
                }


                
            }
            
            @media (max-width: 1480px) {
                
                .container {
                    box-sizing: border-box;
                    width: 97%;
                    max-width: 1290px;
                    margin: 0 auto;
                    margin-top: 20px;
                    border-radius: 30px;
                    box-shadow: 0 5px 5px -5px rgba(0,0,0,0.1);
                }
                
                .product-card {
                    font-family: Georgia, 'Times New Roman', Times, serif;
                    background-color: #fff;
                    flex: 0 0 auto;
                    width: 32%; 
                    min-height: 380px; 
                    border: 1px solid #eee;
                    border-radius: 10px;
                    padding: 20px;
                    position: relative;
                    transition: transform 0.3s;
                    text-decoration: none;
                    display: flex; 
                    flex-direction: column; 
                }

            }
        `;
        document.head.appendChild(style);
    };

    const setEvents = () => {
        const carousel = document.querySelector('.products-container');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (prevBtn && nextBtn && carousel) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -200, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: 200, behavior: 'smooth' });
            });
        }

        document.querySelectorAll('.ebebek-favoriler').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.dataset.id;
                const favorites = JSON.parse(
                    localStorage.getItem('ebebek-local-favoriler') || '[]'
                );

                if (button.textContent === '♡') {
                    button.textContent = '🧡';
                    if (!favorites.includes(productId)) {
                        favorites.push(productId);
                        localStorage.setItem(
                            'ebebek-local-favoriler',
                            JSON.stringify(favorites)
                        );
                    }
                } else {
                    button.textContent = '♡';
                    const index = favorites.indexOf(productId);
                    if (index > -1) {
                        favorites.splice(index, 1);
                        localStorage.setItem(
                            'ebebek-local-favoriler',
                            JSON.stringify(favorites)
                        );
                    }
                }
            });
        });
    };

    init();
})();
