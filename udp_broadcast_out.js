const axios = require('axios');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const getIP = async () => {
  const res = await axios.get('http://localhost:8089/api/get_ip/')
  //console.log("ip", res.data);
  return res.data
}

socket.on('listening', function () {
  socket.setBroadcast(true);
  setInterval(async () => {

    var ip_addr = "";

    try {
      ip_addr = await getIP();
    }
    catch (e) {
      ip_addr = "";
      console.log("error", e.message);
    }

    if (ip_addr != "") {
      const broadcast_msg = "sarc,ip," + ip_addr + ",8089";
      const message = Buffer.from(broadcast_msg)
      socket.send(message, 0, message.length, 24000, '255.255.255.255');
    }

  }, 1000);
});

socket.on('message', function (message, remote) {
  console.log('CLIENT RECEIVED: ', remote.address + ':' + remote.port + ' - ' + message);
});

socket.bind('8888');
