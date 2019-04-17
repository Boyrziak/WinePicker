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
            this.addMessage('Hello! My name is Gaspar, I am your personal sommelier.', 'gaspar', 'text');
            this.addMessage('How can I help you today?', 'gaspar', 'text');
            this.addMessage([{text: 'Find wine for my meal'},{text: 'Find a bottle of wine'}], 'gaspar', 'button');
            preview.show('drop', {direction: 'down'}, 600);
            self.getWineFromApi();
            this.addMessage([{name: 'Bodega Colome,Estate'},{name: 'Bodega Colome,Estate'},{name: 'Bodega Colome,Estate'}], 'gaspar', 'carousel');
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
                this.opened = true;
            } else {
                body.toggle('drop', {direction: 'down'}, 1000);
                $(containers.BUTTON).hide('scale', {percent: 0, direction: 'horizontal'}, 600, function () {
                    $(containers.OPEN_ICON).css('display', 'block');
                    $(containers.CLOSE_ICON).css('display', 'none');
                    $(containers.BUTTON).show('scale', {percent: 0, direction: 'horizontal'}, 600);
                });
                this.opened = false;
                self.previewTimer = setTimeout(function () {
                    $(containers.PREVIEW_CONTAINER).show('drop', {direction: 'down'}, 600);
                }, 10000);
                clearTimeout(self.previewTimer);
            }
        },
        inputSended: function () {
            let self = this;
            let input = $(containers.INPUT);
            self.addMessage(input.text(), 'user', 'text');
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
        },
        addButtons: function (buttons, options) {
            let self = this;
            buttons.forEach(function (button) {
                let newMessage = document.createElement('div');
                $(newMessage).addClass('button');
                $(newMessage).append(button['text']);
                newMessage.addEventListener('click', function () {
                    self.addMessage(button['text'], 'user', 'text');
                });
                $(newMessage).appendTo(containers.QUEUE).show('drop', options, 700);
            })
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
                                                `+card['name']+`
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
        getWineFromApi() {
            let self = this;
            let myInit = {
                method: 'GET'
            };
            let request = new Request('http://ec2-52-30-218-137.eu-west-1.compute.amazonaws.com/top_wine/places/1333/filter?max_price=75', myInit);
            fetch(request).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                console.log(jsonResponse);
            });
        },
        showPreview: function () {
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