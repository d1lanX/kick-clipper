chrome.storage.local.onChanged.addListener(entries => {
  if (!entries.kick_clips) {
    return;
  }

  const data = entries.kick_clips.newValue;

  // {
  //   "iceposeidon": [
  //       {
  //           "clips": [
  //               [
  //                   -100833885,
  //                   -101052076,
  //                   218191
  //               ],
  //               [
  //                   -101063275,
  //                   null
  //               ]
  //           ],
  //           "startTime": 1739053846000,
  //           "streamId": "5db45a81-4aa6-4d9e-a79b-7a49512c1522",
  //           "streamTitle": "Day 38/100 TRAVELING AROUND JAPAN TO OBSCURE PLACES AND VILLAGES 24/7 | 100 DAYS TO LEARN JAPANESE"
  //       }
  //   ],
  //   "xqc": [
  //       {
  //           "clips": [
  //               [
  //                   7465472,
  //                   7454402,
  //                   11070
  //               ]
  //           ],
  //           "startTime": 1739161695000,
  //           "streamId": "ea3b18f0-9a25-4a79-bee3-fb8f837b08f3",
  //           "streamTitle": "🐀LIVE🐀CLICK🐀DRAMA🐀NEWS🐀STUFF🐀VIDEOS🐀REACTS🐀GAMES🐀BEST GAMER🐀WORLD🐀CONFIRMED🐀BEST TAKES🐀BIG IQ GAMER🐀COOL🐀"
  //       }
  //   ]
  // }

  const contentContainer = document.querySelector('section#content');
  const tmplStreamer = document.querySelector('template#streamer');
  const clone = tmplStreamer.content.cloneNode(true);

});