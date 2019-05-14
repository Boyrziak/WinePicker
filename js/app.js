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
        wineList: [],
        place: 1333,
        lang: 'en',
        user_id: 123456,
        findFood: false,
        pause_timer: 500,
        type_timer: 4000,
        wineMessage: '',
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
            // self.translateMessage('Hello');
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
            $('#message_queue').animate({paddingBottom: '8px'}, 600);
            let self = this;
            self.addMessage(inputText, 'user', 'text');
            $(containers.INPUT).empty();
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
                let regExp = /:\s(\w*)/gi;
                let buttonLocale = regExp.exec(button.label);
                if (!buttonLocale) {
                    self.addMessage(button.label, 'user', 'text');
                } else {
                    console.log(buttonLocale);
                    self.lang = buttonLocale[1];
                    self.postToAPI('Hello');
                }
            });
            $(newMessage).appendTo(containers.QUEUE).show('drop', options, 700);
        },
        addCarousel: function (cards) {
            let self = this;
            let carousel = document.createElement('div');
            $(carousel).addClass('card_carousel');
            cards.forEach(function (card) {
                let imageHolder = card.image || 'img/wines_in_my_wish_list.jpg';
                let _score = card.overall_wp_score;
                let foodMatch = card.normalised_foodmatch;
                let normalizedMatch = foodMatch.toString().slice(0, 3);
                let score = _score.toString().slice(0, 3);
                let colorIMG = 'img/' + card.wine_type_name + '.png';
                let ratingColor = '';
                let scoreColor = '';
                if (card.overall_rating > 60 && card.overall_rating <= 65) {
                    ratingColor = '#ca2d26';
                } else if (card.overall_rating > 65 && card.overall_rating <= 70) {
                    ratingColor = '#de5a25';
                } else if (card.overall_rating > 70 && card.overall_rating <= 75) {
                    ratingColor = '#f47220';
                } else if (card.overall_rating > 75 && card.overall_rating <= 80) {
                    ratingColor = '#f8b316';
                } else if (card.overall_rating > 80 && card.overall_rating <= 85) {
                    ratingColor = '#d4da22';
                } else if (card.overall_rating > 85 && card.overall_rating <= 90) {
                    ratingColor = '#abd036';
                } else if (card.overall_rating > 90 && card.overall_rating <= 95) {
                    ratingColor = '#75c042';
                } else if (card.overall_rating > 95) {
                    ratingColor = '#3ab764';
                }
                if (score > 2 && score <= 3) {
                    scoreColor = '#ca2d26';
                } else if (score > 3 && score <= 4) {
                    scoreColor = '#de5a25';
                } else if (score > 4 && score <= 5) {
                    scoreColor = '#f47220';
                } else if (score > 5 && score <= 6) {
                    scoreColor = '#f8b316';
                } else if (score > 6 && score <= 7) {
                    scoreColor = '#d4da22';
                } else if (score > 7 && score <= 8) {
                    scoreColor = '#abd036';
                } else if (score > 8 && score <= 9) {
                    scoreColor = '#75c042';
                } else if (score > 9 && score <= 10) {
                    scoreColor = '#3ab764';
                }
                console.log(card.wine_type_name);
                $(carousel).append(`<div class="wine_card">
                                        <div class="wine_card_header">
                                            <div class="wine_header_name">
                                                ` + card.wine_name + ` ` + card.wine_subtype_name + `
                                            </div>
                                            <div class="wine_header_origin">
                                                ` + card.wine_year + ` ` + card.area_name + `
                                            </div>
                                            <div class="wine_images">
                                                <div class="wine_color">
                                                    <img src="` + colorIMG + `">
                                                </div>
                                                <div class="wine_image">
                                                    <img src="` + imageHolder + `">
                                                </div>
                                                <div class="wine_country">
                                                    <img src="` + card.country_flag + `">
                                                </div>
                                            </div>
                                            <div class="wine_properties">
                                                <div class="wine_property">
                                                    <span class="property_number">` + card.price + `</span>
                                                    <span class="property_name">price</span>
                                                </div>
                                                <div class="wine_property">
                                                    <span class="property_number">` + normalizedMatch + `</span>
                                                    <span class="property_name">food match</span>
                                                </div>
                                                <div class="wine_property">
                                                     <span class="property_number" style="background: ${ratingColor}">` + card.overall_rating + `</span>
                                                     <span class="property_name">rating</span>
                                                </div>
                                                <div class="wine_property">
                                                    <span class="property_number" style="background: ${scoreColor}">` + score + `</span>
                                                    <span class="property_name">score</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="wine_card_description">
                                            <span class="wine_description_name">` + card.wine_subtype_name + `</span>
                                            <p class="wine_description_text">
                                                ` + card.wm_notes + `
                                            </p>
                                        </div>
                                    </div>`);
            });
            let leftButton = document.createElement('div');
            $(leftButton).addClass('carousel_button left_carousel_button');
            $(leftButton).on('click', function () {
                let currentScroll = $(carousel).scrollLeft();
                $('.card_carousel').animate({scrollLeft: currentScroll - 222}, 700);
            });
            $(leftButton).append('<i class="fas fa-chevron-left"></i>');
            let rightButton = document.createElement('div');
            $(rightButton).addClass('carousel_button right_carousel_button');
            $(rightButton).on('click', function () {
                let currentScroll = $(carousel).scrollLeft();
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
        postToAPI: function (value, exit_case) {
            exit_case = exit_case || false;
            let myInit = {
                method: 'GET'
            };
            let self = this;
            console.log('Value = ' + value);
            // let request = new Request('http://127.0.0.1:1880/hello-param/Test');
            let request = new Request('http://localhost:1880/watson/' + self.user_id + '/' + self.place + '/?value=' + value + '&lang=' + self.lang + '&food=' + self.findFood, myInit);
            fetch(request).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                console.log(jsonResponse);
                if (!exit_case) {
                    switch (jsonResponse.type) {
                        case 'dishes':
                            self.foodList = jsonResponse.data;
                            $('.filter_options').empty();
                            $('.filter_input_changeable').empty();
                            jsonResponse.data.forEach(function (dish) {
                                $('.filter').find('.filter_options').append('<div class="filter_option">' + dish + '</div>');
                            });
                            $('#message_queue').animate({paddingBottom: '60px'}, 700);
                            $('.filter').show('drop', {direction: 'right'}, 700);
                            console.log(self.foodList.length);
                            setTimeout(() => {
                                $('#waves_message').show('drop', {'direction': 'left'}, 300);
                                setTimeout(() => {
                                    $('#waves_message').hide('drop', {'direction': 'left'}, 300);
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
                                }, self.type_timer);
                            }, self.pause_timer);
                            $('.filter_input_changeable').keydown(function (e) {
                                e.keyCode === 13 ? (e.preventDefault(), self.inputSended($('.filter_input_changeable').text())) : null;
                            });
                            $('.filter_input_changeable').on('input', () => {
                                console.log('Input: ' + $('.filter_input_changeable').text());
                                let filteredFood = self.foodList.filter(function (element) {
                                    return element.includes($('.filter_input_changeable').text());
                                });
                                $('.filter').find('.filter_options').empty();
                                filteredFood.forEach((food) => {
                                    $('.filter').find('.filter_options').append('<div class="filter_option">' + food + '</div>');
                                });
                                $('.filter_option').on('click', function () {
                                    self.findFood = true;
                                    $('.filter').hide('drop', {direction: 'right'}, 700);
                                    self.addMessage($(this).text(), 'user', 'text');
                                    $('#message_queue').animate({paddingBottom: '8px'}, 700);
                                });
                            });
                            $('.filter_option').on('click', function () {
                                $('.filter').hide('drop', {direction: 'right'}, 700);
                                self.findFood = true;
                                self.addMessage($(this).text(), 'user', 'text');
                                $('#message_queue').animate({paddingBottom: '8px'}, 700);
                            });
                            break;
                        case 'wines':
                            console.log(self.wineList.length);
                            setTimeout(() => {
                                $('#waves_message').show('drop', {'direction': 'left'}, 300);
                                setTimeout(() => {
                                    $('#waves_message').hide('drop', {'direction': 'left'}, 300);
                                    jsonResponse.text.forEach(function (step) {
                                        if (step.response_type === 'text') {
                                            self.addMessage(step.text, 'gaspar', 'text');
                                        } else if (step.response_type === 'option') {
                                            self.addMessage(step.title, 'gaspar', 'text');
                                            step.options.forEach(function (option) {
                                                self.addMessage(option, 'gaspar', 'button');
                                            });
                                        }
                                        self.postToAPI('Exit', true);
                                    });
                                    self.addMessage(jsonResponse.message, 'gaspar', 'text');
                                    setTimeout(function () {
                                        self.addCarousel(jsonResponse.data);
                                    }, 700);
                                    self.postToAPI('Exit', true);
                                }, self.type_timer);
                            }, self.pause_timer);
                            break;
                        case 'pairing':
                            setTimeout(() => {
                                $('#waves_message').show('drop', {'direction': 'left'}, 300);
                                setTimeout(() => {
                                    $('#waves_message').hide('drop', {'direction': 'left'}, 300);
                                    jsonResponse.text.forEach(function (step) {
                                        if (step.response_type === 'text') {
                                            self.addMessage(step.text, 'gaspar', 'text');
                                        } else if (step.response_type === 'option') {
                                            self.addMessage(step.title, 'gaspar', 'text');
                                            step.options.forEach(function (option) {
                                                self.addMessage(option, 'gaspar', 'button');
                                            });
                                        }
                                        self.postToAPI('Exit', true);
                                    });
                                    self.addMessage(jsonResponse.message, 'gaspar', 'text');
                                    self.wineList = jsonResponse.data;
                                    setTimeout(function () {
                                        self.addCarousel(jsonResponse.data);
                                    }, 700);
                                    self.postToAPI('Exit', true);
                                }, self.type_timer);
                            }, self.pause_timer);
                            break;
                        case 'other':
                            setTimeout(() => {
                                $('#waves_message').show('drop', {'direction': 'left'}, 300);
                                setTimeout(() => {
                                    $('#waves_message').hide('drop', {'direction': 'left'}, 300);
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
                                }, self.type_timer);
                            }, self.pause_timer);
                            break;
                    }
                }
            });
        },
        translateMessage: function (message) {
            let self = this;
            let myInit = {
                method: 'POST',
                headers: {apikey: 'butnDp7kFuTJbowyZM7q0juchgLBc2jmbl25ZfUS_jPW', 'Content-Type': 'application/json'},
                data: {
                    text: message,
                    source: self.lang,
                    target: 'en'
                }
            };
            let request = new Request('https://gateway.watsonplatform.net/language-translator/api/v3/translate?version=2018-05-01', myInit);
            fetch(request).then((response) => {
                console.log(response);
            });
            // let translation = text;
            // return translation;
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