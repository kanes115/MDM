#!/usr/local/bin/python3
from http.server import BaseHTTPRequestHandler, HTTPServer


class RequestHandler(BaseHTTPRequestHandler):

	def do_GET(self):
		content = 'Hello'

		content_bytes = bytes(content, 'utf-8')

		self.send_response(200)

		#self.send_header('Content-Length', len(content_bytes))
		self.send_header('Content-Type', 'text/plain')
		#self.send_header('Server', '')
		self.end_headers()

		self.wfile.write(content_bytes)

	#def do_HEAD(self):
		#self.send_response(200)

		#self.send_header('Server', '')
		#self.end_headers()


if '__main__' == __name__:
	server_address = ('', 8888)

	httpd = HTTPServer(server_address, RequestHandler)

	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		pass

	httpd.server_close()
