(async () => {

  /** @typedef {{ lastCheck: string, streamId: string, streamTitle: string, streamStart: string, username: string }} StreamInfo */

  const sleep = (waitingTime) => {
    return new Promise((resolve) => setTimeout(resolve, waitingTime));
  };

  const buttonStyles = `padding: .5rem;border: 1px solid green;font-weight:bold;`;
  const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
  const MAX_RETRIES = 5;
  let actionsButtons;
  let numberOfTries = 0;

  while (numberOfTries <= MAX_RETRIES) {
    
    await sleep(3000);
    
    actionsButtons = document.querySelector("div.flex.shrink-0.flex-col.items-end > div.flex.grow.gap-2");

    if (actionsButtons) {
      break;
    } 
    
    numberOfTries++;
  }

  if (!actionsButtons) {
    return;
  }

  const saveTimestamp = async (type) => {
    startTimeBtn.disabled = type === 'start';
    startTimeBtn.style.opacity = type === 'start' ? '40%' : '100%';
    endTimeBtn.disabled = type === 'end';
    endTimeBtn.style.opacity = type === 'end' ? '40%' : '100%';

    const username = new URL(window.location.href).pathname?.replace('/', '');
    /** @param {StreamInfo} channelInfo */
    const channelInfo = await getStreamerInfo(username);

    const startingTime = new Date(channelInfo.streamStart).getTime();
    const streamTimeStamp = startingTime - Date.now();      

    saveStreamTimestamp({
      timestamp: streamTimeStamp,
      channelInfo,
      startingTime,
      type
    });

  };

  const requestApiInfo = (username) => {
    return fetch(`https://kick.com/api/v1/channels/${username}`, {
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => data)
    .catch(error => {
      console.error(error);
      alert(`error getting the channel information for ${username}`);
    });
  }

  const saveStreamTimestamp = async ({
    timestamp, 
    channelInfo,
    startingTime,
    type
  }) => {

    const data = await chrome.storage.local.get(['kick_clips']);
    const db = data['kick_clips'] ?? {};

    const firstStamp = type === 'start' ? [timestamp, null] : [null, timestamp];

    if (!db[channelInfo?.username]) {
      
      db[channelInfo.username] = [
        {
          streamId: channelInfo.streamId,
          streamTitle: channelInfo.streamTitle,
          startTime: startingTime,
          clips: [
            firstStamp
          ]
        }
      ];

    } else {

      const clipIndex = type === 'start' ? 0 : 1;

      streamers: for (let stream of db[channelInfo.username]) {

        if (stream.streamId !== channelInfo.streamId) {
          continue;
        }

        for (let [index, clip] of stream.clips.entries()) {

          if (clip[clipIndex] === null) {
            stream.clips[index][clipIndex] = timestamp;

            if (clipIndex === 1) {
              stream.clips[index][2] = stream.clips[index][0] - stream.clips[index][1];
            }
            break streamers;
          }
          
          if (index === stream.clips.length - 1) {
            stream.clips.push(firstStamp)
            break streamers;
          }
          
        }
        
      }

    }

    await chrome.storage.local.set({ kick_clips: db });
  }

  const getStreamerInfo = async (username) => {
    let kickStreams = await chrome.storage.local.get(['kick_streams_info']);
    kickStreams = Object.keys(kickStreams).length ? kickStreams?.kick_streams_info : []; 
    const now = Date.now();

    let lastCheckInLessThanOneHour;
    let foundAtIndex;

    let streamerInfo = kickStreams.find((stream, index) => {
      if (stream.username === username) {
        lastCheckInLessThanOneHour = stream.lastCheck + MILLISECONDS_IN_HOUR > now;
        foundAtIndex = index;
        return true;
      }

      return false;
    });

    if (streamerInfo && lastCheckInLessThanOneHour) {
      return streamerInfo;
    }

    const response = await requestApiInfo(username);
    const currentStream = response?.previous_livestreams[0];
    const streamId = currentStream?.video?.uuid;
    const streamTitle = currentStream?.session_title;
    const streamStart = currentStream?.created_at;
    let newEntry;

    if (typeof foundAtIndex !== 'undefined') {
      kickStreams[foundAtIndex].lastCheck = Date.now();
      kickStreams[foundAtIndex].streamId = streamId;
      kickStreams[foundAtIndex].streamTitle = streamTitle;
      kickStreams[foundAtIndex].streamStart = streamStart;

    } else {

      /** @param {StreamInfo} newEntry */
      newEntry = {
        username,
        lastCheck: Date.now(),
        streamId, 
        streamTitle, 
        streamStart
      };

      kickStreams.push(newEntry);
    }

    await chrome.storage.local.set({ kick_streams_info: kickStreams });

    return newEntry ?? kickStreams[foundAtIndex];
  }

  const startTimeBtn = document.createElement("button");
  startTimeBtn.style.cssText = buttonStyles;
  startTimeBtn.textContent = "[ start";
  startTimeBtn.addEventListener("click", (e) => saveTimestamp("start"));

  const endTimeBtn = document.createElement("button");
  endTimeBtn.style.cssText = buttonStyles;
  endTimeBtn.textContent = "end ]";
  endTimeBtn.disabled = true;
  endTimeBtn.style.opacity = '40%';
  endTimeBtn.addEventListener("click", (e) => saveTimestamp("end"));

  actionsButtons.insertAdjacentElement("afterbegin", endTimeBtn);
  actionsButtons.insertAdjacentElement("afterbegin", startTimeBtn);
})();
