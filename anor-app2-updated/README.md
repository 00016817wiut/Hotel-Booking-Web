Anor Avenue Hotel - React project (updated)
How to run:
1) npm install
2) npm start

Notes for you:
- Place your room images at src/assets/images named exactly:
  room.jpg, room1.jpg, room2.jpg, room3.jpg
- EmailJS integration: open src/pages/RoomDetail.js and replace 'SERVICE_ID', 'TEMPLATE_ID', 'USER_ID' with your EmailJS values.
- I used require(...) for images in src/rooms/rooms-data.js so they will be bundled when images exist in the path.
- package.json includes 'browserslist' so 'npm start' should not ask about target browsers.
- Effects: glassmorphism on cards, granate gradient accent color (#8b0f12).
