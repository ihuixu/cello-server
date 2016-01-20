# cello-server

### Nginx
```
server {
	listen       80;
	server_name  xhdev.cello.com xhviolin.cello.com xhxiaoyemian.cello.com;
	charset utf-8;

	access_log  logs/cello.access.log  main;

	location / {
		proxy_set_header Host               $http_host;
		proxy_set_header X-Real-IP          $remote_addr;
		proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
		proxy_pass http://127.0.0.1:6144;
	}
}
```
