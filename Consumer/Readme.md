RabbitMQ me 4 types ke exchange hote hain (easy samajh):

Direct Exchange

Jaise ek VIP counter → jo message "red" tag ke sath aayega woh "red queue" me jayega.

Key match hone par message forward hota hai.

Fanout Exchange

Jaise loudspeaker 📢 → jo bhi message aaya woh sabhi queues me chala jayega.

Topic Exchange

Jaise filter → message ki "topic pattern" ke hisaab se route hota hai (e.g. sms.us, sms.eu).

Headers Exchange (kam use hota hai)

Message ke headers (meta data) ke basis pe decide karta hai.
