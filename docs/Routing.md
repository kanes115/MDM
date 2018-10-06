# Routing

Routing between services is designed in a way so that networking between machines is transient for a user.
One should use services' names in places where they would use IP address or domain name.

## Linux
For mapping IPs to service names file `/etc/hosts` is used.
For mapping domain names to service names there is an environment variable
`HOSTALIASES` used. It points to a file similar in the form to `/etc/hosts` but
which can conatin domain names not only IPs. 

The reason for not simply resolving domain names is to leave a user possibility to
use round robin DNS as a way to load balance between services.

### /etc/hosts and /host.aliases formats
There is a difference between formats of mapping files this techinques
accept.
```
/etc/hosts      IP_from         Domain_to
/etc/hosts      Domain_to       Domain_from 
```

### NOTE
It does not apply to serviecs that would play around with networking in some not standard way of course.
This is because `HOSTALIASES` bypasses function gethostbyname() in glibc.
