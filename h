<script src="/socket.io/socket.io.js"></script>
<script>
    var socket = io();
    var visitorData = {
      referringSite: document.referrer,
      page: location.pathname
    }
    socket.emit('visitor-data', visitorData);
</script>
