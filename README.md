# WinePicker UI

Front-end part of the WinePicker project documentation

Application uses jQuery and jQuery UI
___

## Initialization

Entry point of the app.

### initialize() 

Starts the bot. Initialization method is called outside of the bot. Requests customizaion set on the start. If customization request is successful 
method calls `customizeWidget`. Otherwise standart pattern remains, and bot initialize conversation with **IBM Watson Assistant** with empty request to `postToAPI`. 
After customization call listener is put on widget click, which shows or hides widget and button and hides preview. Also listeners is appended to input, send button and resizing function to input. After it the user id is granted to app. 

----

### customizeWidget (Object{} `customizeJson`)

Function accepts customization set and creates a set of css rules and sets avatar image. After it conversation with IBM Watson Assistant is initialized.

---

### getRandomId (Number `min`, Number `max`)

Accepts minimum and maximum number of the random number. Should be 4 digits

---

## Messaging

Messages are delivered through **Node-RED** to the **IBM Watson Assistant** via `postToAPI` function. User input 
is delivered from user input. Messages are appended to the message queue through `addMessage` function.

### inputSended (Number `text`)

Accepts text or takes text from the input field. Hides additional elements, empties input field and calls `addMessage`.

---

### addMessage (Object{} `value`, String `sender`, String `type`)

Accepts value object, sender and type of content. `sender` is used to define appearance of the message. `type` is used to call appropriate function.

---

### addText (String `text`, String `sender`, Object{} `options`)

Appends and renders text as message in the queue. Sender is used to show proper message sender Options are deprecated. Appends text to the preview.

Also text is translated here when different language is selected. 

If sender is `user` input is sent to **IBM Watson Assistant**.

---

### addButtons (Object{} `button`, Object{} `options`, String `sender`)

Creates, appends, translates and renders buttons. On click listener sends message from the user to the queue

---

### addCarousel (Array[] `cards`)

Appends and renders carousel with cards. Appends click listener to each card.

### postToAPI (String `value`, boolean `exit_case`)

Makes a request to the **Node-RED**. Returned object is parsed and `addMessage` method is called with different values. `exit_case` is used to send request with or without response. 
All messages are pushed into `messageQueue` **Array** and flushed to `flushQueue` function.

---

### flushQueue (Array[] `currentQueue`) 

Accepts **Array** of current message queue and recursively calls `addMessage` it with delays for typing. Typing delay is set as the property of chat objects. Typing animation is shown via html construction with css animation

---

## Cookie

### setCookie (String `name`, String `value`, Object{} `options`)

Sets cookie valued `value` to `name`. `options` can set expiration and prop names.

### getCookie (String `name`)

Gets cookie by `name`

### deleteCookie (String `name`)

Deletes cookie by `name`

## Util 

### scrollQuery (Number `timeout`)

Scrolls widget queue to the bottom with `timeout` speed
