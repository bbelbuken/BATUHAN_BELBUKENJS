(() => {
    if (
        !window.location.pathname.endsWith('/') &&
        !window.location.pathname.endsWith('/index.html')
    ) {
        console.log('wrong page');
        return;
    }

    const init = async () => {
        try {
            const products = await loadProducts();
            buildCSS();
            buildHTML(products);
            setEvents();
            updateFavoriteStatus();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const loadProducts = async () => {
        const cached = localStorage.getItem('ebebekProducts');
        if (cached) {
            const products = JSON.parse(cached);
            return products;
        }
        try {
            const response = await fetch(
                'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json'
            );
            const products = await response.json();
            localStorage.setItem('ebebekProducts', JSON.stringify(products));
            return products;
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    };

    const updateFavoriteStatus = () => {
        const cached =
            JSON.parse(localStorage.getItem('ebebekFavorites')) || [];
        document.querySelectorAll('.product-favorite').forEach((button) => {
            const productId = button.dataset.id;
            if (cached.includes(productId)) {
                button.innerHTML = '🧡';
            } else {
                button.innerHTML = '♡';
            }
        });
    };

    const buildHTML = (products) => {
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'carousel-container';

        const title = document.createElement('h2');
        title.className = 'carousel-title';
        title.textContent = 'Beğenebileceğinizi düşündüklerimiz';
        carouselContainer.appendChild(title);

        const carousel = document.createElement('div');
        carousel.className = 'carousel';
        carouselContainer.appendChild(carousel);

        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-prev';
        prevBtn.innerHTML = '&lt;';
        carousel.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-next';
        nextBtn.innerHTML = '&gt;';
        carousel.appendChild(nextBtn);

        const productsWrapper = document.createElement('div');
        productsWrapper.className = 'carousel-wrapper';
        carousel.appendChild(productsWrapper);

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

            let originalPrice, discountSection;

            if (
                product.original_price &&
                product.original_price !== product.price
            ) {
                originalPrice = document.createElement('span');
                originalPrice.className = 'product-price-original';
                originalPrice.textContent = `${product.original_price} TL`;

                const discount = Math.round(
                    (1 - product.price / product.original_price) * 100
                );
                discountSection = document.createElement('span');
                discountSection.className = 'carousel-discount';
                discountSection.textContent = `%${discount} indirim`;

                priceContainer.appendChild(originalPrice);
                priceContainer.appendChild(discountSection);
            }

            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'product-favorite';
            favoriteButton.dataset.id = product.id;
            productCard.appendChild(favoriteButton);

            productsWrapper.appendChild(productCard);
        });

        const storiesSection =
            document.querySelector('.stories-section') ||
            document.querySelector('.stories') ||
            document.querySelector('.Section1');

        if (storiesSection) {
            storiesSection.insertAdjacentElement('afterend', carouselContainer);
        } else {
            document.body.insertAdjacentElement(
                'afterbegin',
                carouselContainer
            );
        }
    };

    const buildCSS = () => {
        const style = document.createElement('style');
        style.textContent = `
            body {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            .carousel-container {
                width: 100%;
                max-width: 1290px;
                margin: 20px auto;
                padding: 10px 10px;
                box-sizing: border-box;
                background-color: #fef6eb;
                border: 1px solid #eee;
                border-radius: 8px;
            }
            
            .carousel-title {
                font-size: 1.8rem;
                font-weight: bold;
                margin-bottom: 15px;
                margin-left: 15px;
                color: #f28e00;
                font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
            }
            
            .carousel {
                position: relative;
            }
            
            .carousel-wrapper {
                display: flex;
                gap: 15px;
                overflow-x: auto;
                padding: 10px 5px;
                scrollbar-width: none;
            }
            
            .product-card {
                font-family:Georgia, 'Times New Roman', Times, serif;
                background-color: #fff;
                flex: 0 0 auto;
                width: 200px;
                border: 1px solid #eee;
                border-radius: 20px;
                padding: 10px;
                position: relative;
                transition: transform 0.3s;
                text-decoration: none;
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
                height: 180px;
                object-fit: contain;
                margin-bottom: 10px;
            }
            
            .product-card-name {
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
                font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .product-price-current {
                font-weight: bold;
                color: #e91e63;
                font-size: 16px;
            }
            
            .product-price-original {
                text-decoration: line-through;
                color: #999;
                font-size: 14px;
            }
            
            .carousel-discount {
                background-color: #e91e63;
                color: white;
                padding: 2px 5px;
                border-radius: 4px;
                font-size: 12px;
                align-self: flex-start;
            }
            
            .product-favorite {
                position: absolute;
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
                font-size: 25px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .carousel-prev,
            .carousel-next {
                position: absolute;
                background-color: #fef6eb;
                color: #f28e00;
                font-weight: bold;
                top: 45%;
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 100%;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                cursor: pointer;
                z-index: 1;
                font-size: 18px;
                transition: transform 0.3s;

            }
            
            .carousel-prev {
                left: -20px;
            }
            
            .carousel-next {
                right: -20px;
            }

            .carousel-prev:hover,
            .carousel-next:hover {
            background-color: white;
            outline: 1px solid  #f28e00;
            transform: scale(1.1);
            }
            
            @media (max-width: 768px) {
                .product-card {
                    width: 160px;
                }
                
                .product-card-image {
                    height: 140px;
                }
                
                .carousel-prev,
                .carousel-next {
                    width: 30px;
                    height: 30px;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    };

    const setEvents = () => {
        const carousel = document.querySelector('.carousel-wrapper');
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

        document.querySelectorAll('.product-favorite').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.dataset.id;
                const favorites = JSON.parse(
                    localStorage.getItem('ebebekFavorites') || '[]'
                );

                if (button.textContent === '♡') {
                    button.textContent = '🧡';
                    if (!favorites.includes(productId)) {
                        favorites.push(productId);
                        localStorage.setItem(
                            'ebebekFavorites',
                            JSON.stringify(favorites)
                        );
                    }
                } else {
                    button.textContent = '♡';
                    const index = favorites.indexOf(productId);
                    if (index > -1) {
                        favorites.splice(index, 1);
                        localStorage.setItem(
                            'ebebekFavorites',
                            JSON.stringify(favorites)
                        );
                    }
                }
            });
        });
    };

    init();
})();
