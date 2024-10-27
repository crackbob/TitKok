const panel = document.createElement('div');
panel.style.position = 'fixed';
panel.style.width = '250px';
panel.style.height = 'auto';
panel.style.border = '1px solid #444';
panel.style.backgroundColor = 'rgba(25, 25, 25, 0.75)';
panel.style.backdropFilter = 'blur(4px)';
panel.style.color = '#FFF';
panel.style.padding = '10px';
panel.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.5)';
panel.style.borderRadius = '8px';
panel.style.zIndex = '999999';
panel.style.left = '100px';
panel.style.top = '100px';
panel.style.userSelect = "none";
document.body.appendChild(panel);

let header = document.createElement('h2');
header.style.margin = '0';
header.style.textAlign = "center";
header.style.fontSize = "30px";
header.style.color = '#FFF';
header.textContent = "TitKok";
panel.appendChild(header);

function addButton (title, callback) {
  const button = document.createElement('button');
  button.textContent = title;
  button.className = 'button';
  button.style.padding = '8px 12px';
  button.style.width = '100%';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.margin = '5px 0';
  button.style.backgroundColor = 'rgba(55, 55, 55, 0.75)';
  button.style.color = 'white';

  button.addEventListener("click", callback);
  panel.appendChild(button);
}

let isDragging = false;
let offset = { x: 0, y: 0 };

header.addEventListener('mousedown', (event) => {
  isDragging = true;
  offset.x = event.clientX - panel.getBoundingClientRect().left;
  offset.y = event.clientY - panel.getBoundingClientRect().top;
  header.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    panel.style.left = `${event.clientX - offset.x}px`;
    panel.style.top = `${event.clientY - offset.y}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  header.style.cursor = 'grab';
});

let getRoomID = () => {};
async function refreshRoomID() {
  let dummyPage = document.implementation.createHTMLDocument("");
  dummyPage.write(await fetch(location.href).then(async response => await response.text()));
  getRoomID = () => JSON.parse(dummyPage.getElementById("SIGI_STATE")?.innerHTML || "{}")?.LiveRoom?.liveRoomUserInfo?.user?.roomId || "";
};

let defaultParams = {
  "aid": "1988",
  "app_language": "en",
  "app_name": "musical_ly",
  "channel": "googleplay",
  "device_platform": "android",
  "os": "android",
  "priority_region": "US",
  "timezone_name": Intl.DateTimeFormat().resolvedOptions().timeZone
};

function webcastAction (action, params) {
  let paramString = new URLSearchParams({
    ...params,
    ...defaultParams,
    "room_id": getRoomID(),
    "target_id": getRoomID(),
  }).toString();

  fetch(`https://webcast.us.tiktok.com/webcast/room/${action}/?${paramString}`, {
    "method": "POST",
    "mode": "no-cors",
    "credentials": "include"
  });
};

addButton("Live Chat Spammer", () => {
  refreshRoomID();
  let message = prompt("what do you want to spam?")
  setInterval(()=>webcastAction("chat", {"content": message}), 700);
})

addButton("Live Share Spammer", () => {
  refreshRoomID();
  setInterval(()=>webcastAction("share", {"share_type": "2"}), 100);
})
