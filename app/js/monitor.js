const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 80;
let alertFrequency = 1;

//

// Run every 2 seconds
notifyUser({
  title: 'CPU Overload',
  body: `CPU is over ${cpuOverload}%`,
  icon: path.join(__dirname, 'img', 'icon.png'),
});
setInterval(() => {
  // CPU Usage
  cpu.usage().then(info => {
    document.getElementById('cpu-usage').innerText = info.toFixed(2) + '%';

    document.getElementById('cpu-progress').style.width = info + '%';

    // Make progress bar red if overload
    if (info >= cpuOverload) {
      document.getElementById('cpu-progress').style.background = 'red';
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b';
    }

    // Check overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: 'CPU Overload',
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, 'img', 'icon.png'),
      });

      localStorage.setItem('lastNotify', +new Date());
    }
  });

  // CPU Free
  cpu.free().then(info => {
    document.getElementById('cpu-free').innerText = info.toFixed(2) + '%';
  });

  // Uptime
  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
}, 2000);

// Set model
document.getElementById('cpu-model').innerText = cpu.model();

// Computer name

document.getElementById('comp-name').innerText = os.hostname();

// OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

// Total Mem
mem.info().then(info => {
  document.getElementById('mem-total').innerText = info.totalMemMb;
});

// Show days, hours, mins, sec
function secondsToDhms(seconds) {
  // console.log(seconds);
  seconds = +seconds;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d, ${h}h, ${m}m, ${s}s`;
}

// Send notification
function notifyUser(options) {
  new Notification(options.title, options);
  console.log('notifyUser' + new Date());
}

// Check how much time has passed since notification
function runNotify(frequency) {
  console.log('runNotify 87' + new Date());
  if (localStorage.getItem('lastNotify') === null) {
    //store timestamp
    localStorage.setItem('lastNofity', +new Date());
    console.log('runNotify 91' + new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diffTime / 60000);

  if (minutesPassed > frequency) {
    console.log('runNotify 100' + new Date());
    return true;
  } else {
    console.log('runNotify 103' + new Date());
    return false;
  }
}
