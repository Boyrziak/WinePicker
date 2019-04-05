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
                body.toggle('drop', { direction: 'down' }, 1000, function () {
                    body.css('display', 'flex');
                });
                this.opened = true;
            } else {
                body.toggle('drop', { direction: 'down' }, 1000);
                $(containers.BUTTON).hide('scale', {percent: 0, direction: 'horizontal'}, 600, function () {
                    $(containers.OPEN_ICON).css('display', 'block');
                    $(containers.CLOSE_ICON).css('display', 'none');
                    $(containers.BUTTON).show('scale', {percent: 0, direction: 'horizontal'}, 600);
                });
                this.opened = false;
                self.previewTimer = setTimeout(function () {
                    $(containers.PREVIEW_CONTAINER).show('drop', {direction: 'down'}, 600);
                },10000);
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
                let options = { direction: '' };
                sender === 'gaspar' ? (options.direction = 'left') : options.direction = 'right';
                switch (type) {
                    case 'text':
                        self.addText(value, sender, options);
                        break;
                    case 'button':
                        self.addButtons(value, options);
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
            buttons.forEach(function (button) {
                let newMessage = document.createElement('div');
                $(newMessage).addClass('button');
                $(newMessage).append(button['text']);
                $(newMessage).appendTo(containers.QUEUE).show('drop', options, 700);
            })
        },
        addFilter: function () {

        },
        addImage: function (src) {

        },
        addCarousel: function(cards) {

        },
        addCard: function (object) {

        },
        showPreview: function() {
            let self = this;
            self.previewTimer = setTimeout(function () {
                $(containers.PREVIEW_CONTAINER).show('drop', {direction: 'down'}, 600);
            },10000);
            clearTimeout(self.previewTimer);
        },
        scrollQuery: function (timeout) {
            $(containers.QUEUE).animate({ scrollTop: $(containers.QUEUE)[0].scrollHeight }, timeout);
        }
    };
    gaspar.initialize();
});