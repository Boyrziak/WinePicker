jQuery(document).ready(function ($) {
    let containers = {
        BUTTON: '#gaspar_button',
        CONTAINER: '#gaspar_container',
        PREVIEW_CONTAINER: '#gaspar_preview_container',
        OPEN_ICON: '.open_gaspar',
        CLOSE_ICON: '#close_gaspar',
        INPUT: '#gaspar_input',
        SEND_BUTTON: '#send_button',
        QUEUE: '#message_queue'
    };

    let gaspar = {
        button: $(containers.BUTTON),
        body: $(containers.CONTAINER),
        input: $(containers.INPUT),
        send: $(containers.SEND_BUTTON),
        messageQueue: 0,
        previewTimer: null,
        opened: false,
        foodList: [],
        initialize: function () {
            let self = this;
            this.button.on('click', self.clickButton);
            let preview = $(containers.PREVIEW_CONTAINER);
            this.input.keydown(function (e) {
                e.keyCode === 13 ? (e.preventDefault(), self.inputSended()) : null;
            });
            this.send.on('click', function () {
                self.inputSended();
            });
            // this.addMessage('Hello! My name is Gaspar, I will be your sommelier today.', 'gaspar', 'text');
            // this.addMessage('How can I help you today?', 'gaspar', 'text');
            // this.addMessage({label: 'Find wine for my meal'}, 'gaspar', 'button');
            // this.addMessage({label: 'Find a bottle of wine'}, 'gaspar', 'button');
            // preview.show('drop', {direction: 'down'}, 600);
            // // self.postToAPI('Hello');
            // this.addMessage([{name: 'Bodega Colome,Estate'}, {name: 'Bodega Colome,Estate'}, {name: 'Bodega Colome,Estate'}], 'gaspar', 'carousel');
            self.postToAPI('Hello');
        },
        clickButton: function () {
            let self = this;
            let body = $(containers.CONTAINER);
            let preview = $(containers.PREVIEW_CONTAINER);
            if (!self.opened) {
                preview.hide('drop', {direction: 'down'}, 600);
                clearTimeout(self.previewTimer);
                $(containers.BUTTON).hide('scale', {percent: 0, direction: 'horizontal'}, 600, function () {
                    $(containers.OPEN_ICON).css('display', 'none');
                    $(containers.CLOSE_ICON).css('display', 'block');
                    $(containers.BUTTON).show('scale', {percent: 0, direction: 'horizontal'}, 600);
                });
                body.toggle('drop', {direction: 'down'}, 1000, function () {
                    body.css('display', 'flex');
                });
                self.opened = true;
            } else {
                body.toggle('drop', {direction: 'down'}, 1000);
                $(containers.BUTTON).hide('scale', {percent: 0, direction: 'horizontal'}, 600, function () {
                    $(containers.OPEN_ICON).css('display', 'block');
                    $(containers.CLOSE_ICON).css('display', 'none');
                    $(containers.BUTTON).show('scale', {percent: 0, direction: 'horizontal'}, 600);
                });
                self.opened = false;
                self.previewTimer = setTimeout(function () {
                    $(containers.PREVIEW_CONTAINER).show('drop', {direction: 'down'}, 600);
                }, 10000);
                clearTimeout(self.previewTimer);
            }
        },
        inputSended: function (text) {
            let inputText = text || $(containers.INPUT).text();
            $('.filter').hide('drop', {direction: 'right'}, 700);
            let self = this;
            self.addMessage(inputText, 'user', 'text');
            input.empty();
        },
        addMessage: function (value, sender, type) {
            let self = this;
            self.messageQueue++;
            setTimeout(function () {
                let options = {direction: ''};
                sender === 'gaspar' ? (options.direction = 'left') : options.direction = 'right';
                switch (type) {
                    case 'text':
                        self.addText(value, sender, options);
                        break;
                    case 'button':
                        self.addButtons(value, options);
                        break;
                    case 'carousel':
                        self.addCarousel(value);
                        break;
                }
                self.messageQueue--;
                self.messageQueue === 0 ?
                    self.scrollQuery(400) : null;
            }, 600);
        },
        addText: function (text, sender, options) {
            let self = this;
            let newMessage = document.createElement('div');
            $(newMessage).addClass('message ' + sender + '_message');
            $(newMessage).append(text);
            $(newMessage).appendTo(containers.QUEUE).show('drop', options, 700);
            $('#gaspar_preview_container').find('.preview_text').empty().text(text);
            if (sender === 'user') {
                // console.log(text);
                // // self.postToAPI(text);
                // if (text === 'Find a specific wine bottle') {
                //     console.log(text);
                //     self.addMessage('Your filters: Italy', 'gaspar', 'text');
                //     self.addMessage('Should I proceed?', 'gaspar', 'text');
                // } else if (text === 'Hello') {
                //     self.postToAPI(text);
                // } else if (text === 'Exit') {
                //     self.postToAPI(text);
                // } else if (text === 'Yes') {
                //     self.addMessage('Find best wines out of 109 of our wine list', 'gaspar', 'text');
                //     self.addMessage([{name: 'Bodega Colome,Estate'}, {name: 'Bodega Colome,Estate'}, {name: 'Bodega Colome,Estate'}], 'gaspar', 'carousel');
                // } else if (text === 'Find a wine for your meal') {
                //     $('#message_queue').animate({paddingBottom: '60px'}, 700);
                //     self.addMessage('What are you eating?', 'gaspar', 'text');
                //     self.foodList = ["Beef bbq", "Beef black pepper sauce", "Beef braised, stew", "Beef burger", "Beef Carpacio", "Beef curry", "Beef filet", "Beef flank steak", "Beef new york strip", "Beef porterhouse", "Beef rib eye", "Beef sirloin", "Beef steak", "Beef Tartare", "Beef teriyaki", "Spicy beef", "Steak Pie", "Charcuterie", "Bbq chicken", "Buffalo Chicken Wings", "Chicken Club Sandwich", "Chicken lemon sauce", "Chicken Pie", "Chicken salad", "Chicken Wings", "Chicken with creamy sauce", "Chicken with mushroom", "Chicken with red wine sauce", "Grilled chicken", "Korean Chicken Wings", "Roasted chicken", "Spicy chicken", "Sweet & Sour Chicken", "Bbq duck", "Duck a l'Orange", "Duck breast", "Duck Confit", "Peking duck", "Roasted duck", "Pheasant, Partridge", "Venison", "Grilled Lamb", "Lamb bbq", "Lamb Leg", "Lamb shank, shoulder", "Lamb stew", "Roasted lamb", "Pork bbq", "Pork casserole, tomatoes sauce", "Pork chops", "Pork in creamy sauce", "Pork rib eye", "Pork sweet and sour", "Pulled Pork", "Pulled Pork Buger", "Roasted pork", "Roated Pork Belly ", "Goose", "Guinea fowl", "Pigeon", "Rabbit", "Roasted turkey", "Turkey salad", "Turkey sandwich", "Veal chop", "Veal osso buco", "Veal saltimbocca", "Veal scallops", "Veal stew", "Clams with creamy sauce", "Clams with tomatoes ", "Cod in creamy sauce", "Fish & chips cod", "Grilled cod", "Oven cod", "Poached cod", "Crab salad", "Dressed crab", "Pasta and crab", "Thai crab cake", "Deep fried fish", "Fish Burger", "Fish in creamy sauce", "Fish Oven-roasted", "Fish pie", "Fish raw, tartare, carpaccio", "Fish soup / stew", "Grilled fish", "Pan fried fish", "Grilled Hake", "Fish & chips halibut", "Grilled halibut", "Halibut in creamy sauce", "Oven halibut", "Poached halibut", "Seared halibut", "Asian stir fried lobster", "Boiled lobster served cold", "Grilled lobster", "Lobster with creamy sauce", "Monkfish in creamy sauce", "Monkfish in tomato sauce ", "Seared monkfish", "Oven-roasted Salmon", "Poached salmon", "Salmon blackened, bbq, Cajun", "Salmon Gravlax", "Salmon grilled / bbq", "Salmon pasta", "Salmon raw, tartare, carpaccio", "Salmon Salad", "Salmon teriyaki", "Seared salmon", "Smoked salmon", "Spicy salmon", "Sardines", "Grilled scallop", "Pan seared scallop", "Scallop carpaccio", "Scallop with creamy sauce", "Grilled sea bass", "Oven sea bass", "Pan seared sea bass", "Sea bass ceviche", "Sea bass in creamy sauce", "Sea bass raw, tartare, carpaccio", "Sea Bream ceviche", "Hot Mussels", "Raw Oyster", "Seafood platter", "Shellfish stew", "Shellfish with pasta", "Soup / chowder", "Shrimp boiled served cold", "Shrimp deep fried / tempura", "Shrimp grilled / bbq", "Shrimp salad", "Shrimp with pasta and creamy sauce", "Shrimp with pasta and tomatoes sauce ", "Thai green curry with shrimp", "Grilled snapper", "Snapper with sauce", "Grilled sole", "Sole in creamy sauce", "Sole meuniere", "Deep fried squid", "Grilled squid", "Squid risotto", "Squid with squid ink", "Squid with tomatoes sauce", "Stuffed squid", "Oven trout", "Pan seared trout", "Smoke trout", "Seared tuna", "Tuna grilled / bbq", "Tuna raw, tartare, carpaccio", "Tuna salad", "Yellowfin Tuna", "Full English Breakfast", "Veggie Breakfast", "Eggs Florentine", "Eggs Benedict", "Eggs Royale", "Caesar Salad", "Chicken caesar salad", "Citrus Salad", "Crab salad", "Greek salad", "Nicoise salad", "Salad with cheese", "Seafood salad", "Squash salad", "Cajun Halloumi Fries", "Chicken and Cheese Sanwiches", "Hot Dog", "Salted Beef Sandwishes", "Smoked Almond", "Tomato, Mozzarella, Pesto Sandwishes", "Truffle Popcorn", "Tuna Sandwich", "Gaspacho", "Asian stir fried vegetable", "Asparagus risotto", "Casserole / Stew", "Couscous", "Mushroom grilled", "Mushroom risotto", "Mushroom Wild", "Quiche", "Ratatouille", "Roasted red peppers", "Vegetarian Curry", "Veggie Burger", "Zucchini", "Cooked asparagus", "Spinach Empanadas", "Beef Empanadas", "Bife ancho", "Ham Croquette", "Provolone Cheese", "Peking duck", "Satays", "Stir-fried noodle", "Boeuf  bourgignon", "Cassoulet", "Choucroute", "Coq au vin", "Escargot", "Moule mariniere", "Raclette", "Chicken tikka masala", "Lamb curry", "Tandoori chicken", "Burrata", "Carbonara", "Lasagna", "Mushroom risotto", "Pizza", "Pizza 4 cheeses", "Pizza 4 seasons (ham & mushrooms)", "Pizza Margherita", "Pizza Marinera (seafood)", "Pizza Pepperoni", "Pizza Prosciutto", "Seafood Pasta", "Spaghetti and Cheese", "Spaghetti Bolognese", "Spaghetti with Meatballs", "Spaghetti with Tomatoes", "Tagliatelle Salsiccia (sausage)", "Tortellini", "Truffles risotto", "Vegetables risotto", "Fajitas", "Taco", "Garlic shrimp", "Iberico Bellots", "Jamon / chorizo", "Meat paella", "Mix paella", "Pulpo", "Seafood paella", "Tapas meat", "Tapas party", "Tapas seafood", "Cashew chicken", "Pad thai", "Stir-fried noodle", "Thai Salad", "Pasta Jambalaya", "Acadian Burnt Ends"];
                //     self.foodList.forEach(function (option) {
                //         $('.filter').find('.filter_options').append('<div class="filter_option">'+option+'</div>');
                //     });
                //
                //     $('.filter_option').on('click', function() {
                //         $('.filter').hide('drop', options, 700);
                //         self.addMessage('Beef burger', 'user', 'text');
                //         $('#message_queue').animate({paddingBottom: '8px'}, 700);
                //     });
                //     $('.filter').show('drop', options, 700);
                // } else if (text === 'Beef burger') {
                //     self.addMessage('Find best 3 wines out of 30 that mach your criteria', 'gaspar', 'text');
                //     self.addMessage([{name: 'Bodega Colome,Estate'}, {name: 'Bodega Colome,Estate'}, {name: 'Bodega Colome,Estate'}], 'gaspar', 'carousel');
                // }
                self.postToAPI(text);
            } else {
                if ($('#gaspar_container').css('display') !== 'flex') {
                    $('#gaspar_preview_container').show('drop', options, 700);
                }
            }
        },
        addButtons: function (button, options) {
            let self = this;
            let newMessage = document.createElement('div');
            $(newMessage).addClass('button');
            $(newMessage).append(button.label);
            newMessage.addEventListener('click', function () {
                self.addMessage(button.label, 'user', 'text');
            });
            $(newMessage).appendTo(containers.QUEUE).show('drop', options, 700);
        },
        addFilter: function () {

        },
        addImage: function (src) {

        },
        addCarousel: function (cards) {
            let self = this;
            let carousel = document.createElement('div');
            $(carousel).addClass('card_carousel');
            cards.forEach(function (card) {
                $(carousel).append(`<div class="wine_card">
                                        <div class="wine_card_header">
                                            <div class="wine_header_name">
                                                ` + card['name'] + `
                                            </div>
                                            <div class="wine_header_origin">
                                                2016 Calchaqui Valley
                                            </div>
                                            <div class="wine_images">
                                                <div class="wine_color">
                                                    <img src="img/red%20wines.png">
                                                </div>
                                                <div class="wine_image">
                                                    <img src="img/Oval%20Copy.png">
                                                </div>
                                                <div class="wine_country">
                                                    <img src="img/flag.png">
                                                </div>
                                            </div>
                                            <div class="wine_properties">
                                                <div class="wine_property">
                                                    <span class="property_number">£40</span>
                                                    <span class="property_name">price</span>
                                                </div>
                                                <div class="wine_property">
                                                    <span class="property_number">£40</span>
                                                    <span class="property_name">price</span>
                                                </div>
                                                <div class="wine_property">
                                                     <span class="property_number">£40</span>
                                                     <span class="property_name">price</span>
                                                </div>
                                                <div class="wine_property">
                                                    <span class="property_number">£40</span>
                                                    <span class="property_name">price</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="wine_card_description">
                                            <span class="wine_description_name">Malbec; Full bodied</span>
                                            <p class="wine_description_text">
                                                Predominantly Malbec with small
                                                amounts of Tannat, Cabernet
                                                Sauvignon, Petit Verdot and Syrah.
                                                Deep bright red with a magenta hue.
                                               Aromas of black and red fruits
                                                including blackberries,
                                               blackcurrants, raspberries and
                                                cherries, with touches of violet floral
                                            </p>
                                        </div>
                                    </div>`);
            });
            let leftButton = document.createElement('div');
            $(leftButton).addClass('carousel_button left_carousel_button');
            $(leftButton).on('click', function () {
                let currentScroll = $(carousel).scrollLeft();
                console.log(currentScroll);
                $('.card_carousel').animate({scrollLeft: currentScroll - 222}, 700);
            });
            $(leftButton).append('<i class="fas fa-chevron-left"></i>');
            let rightButton = document.createElement('div');
            $(rightButton).addClass('carousel_button right_carousel_button');
            $(rightButton).on('click', function () {
                let currentScroll = $(carousel).scrollLeft();
                console.log(currentScroll);
                $('.card_carousel').animate({scrollLeft: currentScroll + 222}, 700);
            });
            $(rightButton).append('<i class="fas fa-chevron-right"></i>');
            let carouselWrap = document.createElement('div');
            $(carouselWrap).addClass('carousel_holder');
            $(carouselWrap).append(leftButton);
            $(carouselWrap).append(rightButton);
            $(carouselWrap).append(carousel);
            $('#message_queue').append(carouselWrap);
        },
        addCard: function (card) {

        },
        getWineFromApi: function () {
            let self = this;
            let myInit = {
                method: 'GET'
            };
            let request = new Request('http://ec2-52-30-218-137.eu-west-1.compute.amazonaws.com/top_wine/places/1333/filter?max_price=75', myInit);
            fetch(request).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                console.log(jsonResponse.output);
            });
        },
        postToAPI: function (value) {
            let myInit = {
                method: 'GET'
            };
            let self = this;
            console.log('Value = ' + value);
            // let request = new Request('http://127.0.0.1:1880/hello-param/Test');
            let request = new Request('http://008eb7fc.ngrok.io/watson/' + value, myInit);
            fetch(request).then(function (response) {
                console.log(response);
                return response.json();
            }).then(function (jsonResponse) {
                console.log(jsonResponse);
                if (jsonResponse.type === 'dishes') {
                    self.foodList = [];
                    jsonResponse.data.forEach(function (dish) {
                        // self.foodList.push(dish);
                        $('.filter').find('.filter_options').append('<div class="filter_option">' + dish + '</div>');
                        // dish.forEach(function (option) {
                        //
                        // });
                    });
                    $('#message_queue').animate({paddingBottom: '60px'}, 700);
                    $('.filter').show('drop', {direction: 'right'}, 700);
                    $('.filter_option').on('click', function () {
                        $('.filter').hide('drop', {direction: 'right'} , 700);
                        self.addMessage($(this).text(), 'user', 'text');
                        $('#message_queue').animate({paddingBottom: '8px'}, 700);
                    });
                    console.log(self.foodList.length);
                    jsonResponse.text.forEach(function (step) {
                        if (step.response_type === 'text') {
                            self.addMessage(step.text, 'gaspar', 'text');
                        } else if (step.response_type === 'option') {
                            self.addMessage(step.title, 'gaspar', 'text');
                            step.options.forEach(function (option) {
                                self.addMessage(option, 'gaspar', 'button');
                            });
                        }
                    });
                    $('.filter').keydown(function (e) {
                        e.keyCode === 13 ? (e.preventDefault(), self.inputSended()) : null;
                    });
                } else if (jsonResponse.type === 'other') {
                    jsonResponse.response.forEach(function (step) {
                        if (step.response_type === 'text') {
                            self.addMessage(step.text, 'gaspar', 'text');
                        } else if (step.response_type === 'option') {
                            self.addMessage(step.title, 'gaspar', 'text');
                            step.options.forEach(function (option) {
                                self.addMessage(option, 'gaspar', 'button');
                            });
                        }
                    });
                }
            });
        },
        showPreview: function (text) {
            let self = this;
            self.previewTimer = setTimeout(function () {
                $(containers.PREVIEW_CONTAINER).show('drop', {direction: 'down'}, 600);
            }, 10000);
            clearTimeout(self.previewTimer);
        },
        scrollQuery: function (timeout) {
            $(containers.QUEUE).animate({scrollTop: $(containers.QUEUE)[0].scrollHeight}, timeout);
        }
    };
    gaspar.initialize();
});