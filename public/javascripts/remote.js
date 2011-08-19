$(function(){
   var socket = io.connect();
   socket.emit('remote-identify', { id: 1234 });

   $('a').click(function(){
    socket.emit(this.id); 
    return false;
   });
});
