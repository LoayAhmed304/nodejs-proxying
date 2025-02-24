# Symmetrical vs Asymmetrical Encryption

## Symmetrical (AES)

> Only 1 key, and it's used for **both** encrypting & decrypting

<center><img src="https://imgur.com/cKK8uvc.png" alt="Image" width="50%"></center>

### pros

- Fast, since the algorithm used doesn't do complicated mathematical operations
- Therefore efficient(fast) for large data

### cons

- Hard to share the key
  - When that key is shared, it can be sniffed by other third parties, and therefore the data can be decrypted easily

## Asymmetrical (RAS - "3 people")

> Two keys are used, one is public that encrypts, the other is private to decrypt

<center><img src="https://imgur.com/YGNX1Zl.png" alt="Image" width="50%"></center>

### pros

- Safe to share the public key, and it can be sniffed as it's only used for encrypting
- Very suitable and safe for small data

### cons

- Very slow, since it uses very complicated mathematical operations (very large prime numbers raised to very high powers)
- Inefficient for large-sized data

> What actually happens is that we use the Asymmetric Encryption just to transfer the key of the symmetric encryptions, then we continue sharing symmetrically

# TLS in Handshake

> Handshake is what happens as the first step in HTTP requests in TCP protocol, to start the actual communication between the client and server, and there are ways to handle this handshake

## TLS 1.2

- ##### Client sends hello to the server, with options object that has all the client supported encryptions/protocols
- ##### Server responds to the client with its certificates that contains the agreed protocol/encryption algorithm to be used alongside the public key
- ##### Client encrypts the symmetric key using the public key sent by the server, and sends that symmetric key encrypted to the server (dangerous cuz if decrypted somehow -by accessing server private key somehow- it'll be exposed to the world)
- ##### Server responds that it's finished and ready to communicate

### Cons

- Very slow due to the long communication that happens before actually starting to communicate/share files
- Insecure key sharing, if someone managed to access the private key of the server, everything will be gone

  <center><img src="https://imgur.com/CGzhkSn.png" alt="Image" width="50%"></center>

## Diffie Hellman - TLS 1.3

> A an improvement algorithm to TLS 1.2 for sharing the symmetric keys
> The main issue is the transferring of the symmetric key, we want to maximize it's security

- There are 3 keys: 2 private and 1 public
- The client has his own private key and the server has his own private key
- The combination of these 3 keys, results in the symmetric key to be used

  <center><img src="https://imgur.com/qiQMTy3.png" alt="Image" width="30%"></center>

- The combination of any private key and the public key is unbreachable and therefore can be shared in the public and sniffed (can do nothing with them).

  <center><img src="https://imgur.com/xpgUOe8.png" alt="Image" width="30%"></center>

- So, the first thing that happens, is that the client sends a combination of his private key + public key, and also sends the public key separately to the server.
- The server receives them, and adds his private key to the combination given, resulting in the symmetric key ready with the server to be used in communications.
- The server then sends a combination of his private key + public key to the client.
- The client takes this combination and adds his private key to it, result in the symmetric key ready with the client to be used in communications.
- Now both ends have the symmetric key that encrypts AND decrypts, they're ready to send/receive data as they want.

  <center><img src="https://imgur.com/KXX1sxT.png" alt="Image" width="50%"></center>

  > Now what happened is that instead of sending a key that is totally dependent on the private key of the server, which was dangerous if the server got breached or his data got leaked, now it requires to have BOTH keys in order to be able to obtain the symmetric key that's used for encryption/decryption

# Network Address Translation (NAT)

> If I have a server in the same internal subnetwork, I can call it directly through the router. But what if I have something I want to send to the external network/world? It can't be done directly, because my IP address in this case, is only local (e.g., 192.168.1.3). This is where NAT comes in

## What NAT actually does?

###### NAT mainly maps my private IP address to a public IP address so it can be used to communicate with the outer world, and that public IP address is unique to every single user/server in the world.

## Steps (simplified)

- My Laptop (e.g., private IP of 192.168.1.3), sends a packet in layer 3ish with the sender and receiver IP addresses
- It'll look something like this

<center><img src="https://imgur.com/984qcHy.png" alt="Image"></center>

- That's a packet which contains my laptop sending data to another laptop (both on the same network)
- The Router can route them with no troubles as long as they're both on the same internal subnetwork
- But what if that packet, had the destination IP of an address that doesn't belong to the same internal subnetwork? How does it detect it?
- If that IP doesn't start with exactly 192.168.1.x (or by checking the subnet mask values), the router knows that it's not in the same subnetwork, and hence the following steps
- So instead of sending that packet to the receiver directly, the laptop forwards the packet to the router (or default gateway IP, which is 192.168.1.1) instead, which is the router private IP (gateway). But the destination IP in the packet remains unchanged.
- The router now (or the gateway) got the private IP address of sender, it then changes it to the router own public IP address (e.g., 44.11.5.17), to be able to communicate with the world through it.
- So now the packet becomes like this

 <center><img src="https://imgur.com/VZ9qaht.png" alt="Packet Image" width="50%"></center>

- Now, the data is sent and we're cool. Now how do we receive it back and redirect it to the actual sender? Since we changed the sender private IP address to the router public IP address and it's "overwritten" right? Remember?
- Here the NAT takes place.
- The router keeps a NAT table, which stores 3 IPs:
  - The private IP + private port (sender)
  - The public IP of the router that replaced itself with the sender + Assigned port (NAT translation)
  - The receiver/destination IP (external server)
- Now when we get a response back from the server (of course to the public IP, the one the server got the request from), it checks the NAT table and matches that server in the receiver columns, and redirects the response to the private IP again (e.g., 192.168.1.2).
- And finally we got back the response.
- Voila!🪄🪄🪄

## NAT Other Applications

### Port Forwarding

> When I host a server on my own laptop (private IP of 192.168.1.3), and want the world to access it. So I set up **port forwarding** on my router, which forwards incoming traffic on 44.11.5.17:80 (public IP address of the router, port 80 for HTTP) forwards it to 192.168.1.3:80 (internal private server). So now whenever someone visits http://44.11.5.17 he'll be redirected to 192.168.1.3:80

##### ⭐Port Forwarding extra info

- Can I do it?
  Yes, very easily!! I just host my server using nodejs, and make it listen to port 80. Then open my router settings and go to NAT tab and change the Port Forwarding to my laptop ip (get from CMD ipconfig) and port 80 (to receive http) and make it TCP. VOILA!!🪄

### L4 Load Balancing

> When I host multiple servers to serve 1 hosted website, since 1 server isn't enough to handle all traffic. So any request is sent to the router (44.11.5.17), instead of forwarding that to a single private IP address as port forwarding, it distributes the requests evenly on all servers (e.g., 192.168.1.3, 192.168.1.4, 192.168.1.5) dynamically.

# Proxy vs Reverse Proxy Server

> When I want to go to a certain IP address (or website), I must first pass through the proxy. Meaning if I want to go to google.com, I first will go through a specific proxy, which transfers me to google.com, so there's no actual direct communication between the client and the desired server, in the presence of a proxy.

## Proxy

<center><img src="https://imgur.com/UXDCJvK.png" alt="Packet Image" width="50%"></center>
It is the "blockage" between the client, and the desired server. It lies in between them.

### Usage

- Caching
  - Once data has been retrieved earlier to this client, and I requested through the proxy, it'll serve it again without needing to go ask for it from the server itself (e.g., google.com)
- Anonymity
  - It provides some kind of anonymous requests to the server, since the server only serves the proxy, and no direct deals with clients, so it doesn't know who's requesting what.
- Logging
  - Keep track (logs) of all incoming & outgoing requests to the server, might be helpful for deciding what should be cached in the future, activity analysis, marketing campaigns, etc...
- Block Sites
  - Certain governments can force their clients to always go through their proxy, and with that it'll prevent the visit of some websites. (it's like set of block list in a proxy properties)
- Microservices
  - We can set a specific proxy, which just deals with incoming networking stuff, and upgrading/downgrading and making sure that they match the server needs. For example, if client sent an HTTP request, and the server only deals with secured requests, this proxy will configure it for the server and redirects it.

## Reverse Proxy

<center><img src="https://imgur.com/MkCxum1.png" alt="Packet Image" width="50%"></center>

It is the "blockage" between client and the final destination, not the desired destination. The client knows that his request will go through google.com, but he doesn't know what will google.com do with it, because google.com in this case is actually a proxy itself, which redirects his requests to specific servers.

### Usage

- Caching
	- Same as proxy, tries to prevent the request to go to the backend, and saves some frequent retrieved data.
- Load Balancing
	- Tries to distributes the requests to different servers, to prevent overload (or DoS for example)
- Ingress
	- Does certain filtering to the request, and redirects the request  to specific servers. For example, any request which needs image file response, will go to server 1, etc...
- ⭐Canary Deployment 🐥
	- If there's a new feature being implemented, the proxy will start to redirect certain percentage of users to specific server (which has the new updates), and the rest to the original old server. Little by little until making sure that there are no problems then all users are transferred.
	- Using NGNIX for example... (can act as both proxy and webserver)
- Microservices
	- Same as proxies

## Notes

- Proxies can exist as reverse proxies as well, in the same time. Called **Service Mesh**
- Proxies can be used as VPN for anomity, since it redirects the requests, making all requests go to the desired website/server without knowing the client sending it. **But** it comes with risks because some proxies can see everything of the client/sender, so VPNs are safer for such cases.
- There are many types of proxies
  - Web Proxy (HTTP) which works only for HTTP/s requests (web traffic)
  - Secure Web Proxy (HTTPS) same as Web Proxy but more security between client and the proxy itself
  - SOCKS proxy: More flexible that HTTP proxy, it supports all kinds of traffic such as gaming, torrents, emails, etc.. Not just web traffic.
