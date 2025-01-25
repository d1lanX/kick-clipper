(async () => {
  const sleep = (waitingTime) => {
    return new Promise((resolve) => setTimeout(resolve, waitingTime));
  };

  const MAX_RETRIES = 5;
  let actionsButtons;
  let numberOfTries = 0;

  while (numberOfTries < MAX_RETRIES) {
    actionsButtons = document.querySelector(".flex.grow.gap-2");

    if (actionsButtons) {
      break;
    }

    if (!actionsButtons) {
      alert("we didnt find the actions buttons on kick. retrying...");
    }

    await sleep(1000);
    numberOfTries++;
  }

  // const saveTimestamp = async (type) => {
  //   if (!type) {
  //     alert(`we didnt understand the type for this? :/`);
  //     return;
  //   }

  //   const currentTimeStamp = await getCurrentTime();

  //   if (!currentTimeStamp) {
  //     alert("we couldnt get the timestamp");
  //     return;
  //   }

  //   const { liveStreamId, liveStreamURL } = await getLiveStreamInfo();

  //   if (!liveStreamId || !liveStreamURL) {
  //     alert("we need both the url and id for the stream to save it");
  //     return;
  //   }

  //   let kickStorage;

  //   try {
  //     kickStorage = JSON.parse(localStorage.getItem("kick_storage"));
  //   } catch (err) {
  //     alert(
  //       `we had an error parsing the json or saving a new timestamp! ${err}`
  //     );
  //     return;
  //   }

  //   if (!kickStorage[liveStreamId]) {
  //     kickStorage[liveStreamId] = {
  //       liveStreamId,
  //       liveStreamURL,
  //       timestamps: [],
  //     };
  //   }

  //   const timestamps = kickStorage[liveStreamId].timestamps;
  //   if (!timestamps.length) {
  //     kickStorage[liveStreamId].timestamps.push([]);
  //   }

  //   outer: for (let i = 0; i < timestamps.length; i++) {
  //     const length = timestamps[i].length;

  //     switch (true) {
  //       case (length === 1 && type === "start"):
  //         kickStorage[liveStreamId].timestamps.push([currentTimeStamp]);
  //         break outer;
  //       case (length === 0 && type === "start"):
  //         kickStorage[liveStreamId].timestamps[i].push([currentTimeStamp]);
  //         break outer;
  //       case (length === 1 && type === "end"):
  //         kickStorage[liveStreamId].timestamps[i].push([currentTimeStamp]);
  //         break outer;
  //       default:
  //         break;
  //     }
  //   }
  // };

  // const getCurrentTime = async () => {
  //   const video = document.querySelector("video");
  //   if (!video) {
  //     alert("we didnt find the video element!");
  //     return;
  //   }

  //   video.pause();
  //   await sleep(300);
  //   video.play();

  //   return document.querySelector(".tabular-nums").textContent;
  // };

  // const getLiveStreamInfo = async () => {
  //   const channelNameElement = document.getElementById("channel-username");
  //   channelNameElement.click();
  //   await sleep(200);

  //   const currentURL = new URL(window.location.href).pathname;

  //   const currentStreamAnchor = document.querySelector(
  //     `a[href^="${currentURL}/videos/"]`
  //   );

  //   if (!currentStreamAnchor) {
  //     alert("we couldnt find the current stream link!");
  //     return;
  //   }

  //   const currentStreamLink = currentStreamAnchor.href;
  //   const currentStreamId = currentStreamLink.split("/videos/")[1];

  //   return {
  //     liveStreamURL: currentStreamLink || null,
  //     liveStreamId: currentStreamId || null,
  //   };
  // };

  // const startTimeBtn = document.createElement("button");
  // startTimeBtn.style.cssText =
  //   "padding: .5rem;border: 1px solid green;font-weight:bold;";
  // startTimeBtn.textContent = "[ start";
  // startTimeBtn.addEventListener("click", (e) => saveTimestamp("start"));

  // const endTimeBtn = document.createElement("button");
  // endTimeBtn.style.cssText =
  //   "padding: .5rem;border: 1px solid green;font-weight:bold;";
  // endTimeBtn.textContent = "end ]";
  // endTimeBtn.addEventListener("click", (e) => saveTimestamp("end"));

  // actionsButtons.insertAdjacentElement("afterbegin", endTimeBtn);
  // actionsButtons.insertAdjacentElement("afterbegin", startTimeBtn);
})();
