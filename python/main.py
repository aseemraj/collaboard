from socket import *
from time import ctime
HOST = 'localhost'
PORT = 8080
BUFSIZE = 1024
ADDR = (HOST, PORT)

tcpServerSock = socket(AF_INET,SOCK_STREAM)
tcpServerSock.bind(ADDR)
tcpServerSock.listen(50)

while True:
  print 'Waiting for a connection ...'
  tcpClientSock, addr = tcpServerSock.accept()
  print '...connected from:', addr

  while True:
    data = tcpClientSock.recv(BUFSIZE)
    if not data:
      break
    tcpClientSock.send('[%s] %s' % (ctime(), data))
    
  tcpClientSock.close()
tcpServerSock.close()