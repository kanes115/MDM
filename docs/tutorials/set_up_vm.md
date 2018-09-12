# How to setup Virtual Machine with ssh server

## Persistence of this file
This file is not intented to be left in the repo.

## Steps

I assume there is VirtualMachine with linux on it.

1. We need to set NAT connection.
   * Enter virtual machine's settings
   * Go to networking tab
   * Hit extended/advanced
   * Enter Przekierowywanie portów
   * Add entry: `host ip`: 127.0.0.1, `host port`: 2222, `guest ip` <<guest_ip>>, `guest port`: 22
     (where `guest_ip` is the ip of virtual machine in its private network - you check it with ifconfig inside the machine)
2. Inside the machine install `sudo apt-get install openssh-server`
3. As root, edit the sshd_config file in /etc/ssh/sshd_config. 
     Add a line in the Authentication section of the file that says PermitRootLogin yes. 
     This line may already exist and be commented out with a "#". In this case, remove the "#".
4. Be sure to know root's password
5. Add ssh keys to virtual box, running `ssh root@localhost -p 2222` on host machine
6. Add entry in ~/.ssh/config (using ~/.ssh/id_rsa as IdentityFile)

### Bridged mode (preffered probably)

* Use `Mostkowana karta sieciowa` in settings instead of `NAT`.
* On guest machine add static IP address from the range of your host network. `ip addr add <<ip_address_you_want_to_give_to_guest>>/<<mask>> dev <<interface>>`
* Be sure to add the default gateway on guest machine (set to the same as on the host machine): `ip route add default via <<ip_here>>`
 
