"""Start or reuse the local UI Collection preview, independently of a chat turn."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import urlopen
import argparse
import os
import socket
import subprocess
import sys
import time
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
HOST, PORT = '127.0.0.1', 8765
URL = f'http://{HOST}:{PORT}/index.html#libraries'
HEALTH = f'http://{HOST}:{PORT}/__ui_collection_preview__'
IDENTITY = b'UI Collection preview'


class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/__ui_collection_preview__':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(IDENTITY)))
            self.end_headers()
            self.wfile.write(IDENTITY)
            return
        super().do_GET()

    def end_headers(self):
        # Local previews should pick up saved HTML, CSS and JavaScript immediately.
        if self.path != '/__ui_collection_preview__':
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def ready():
    try:
        with urlopen(HEALTH, timeout=1) as response:
            return response.read() == IDENTITY
    except OSError:
        return False


def start():
    if ready():
        print('Preview already running: ' + URL)
        return
    with socket.socket() as probe:
        try:
            probe.bind((HOST, PORT))
        except OSError as error:
            raise RuntimeError('Port 8765 is occupied by another service. No process was stopped.') from error
    logs = ROOT / '.qa'
    logs.mkdir(exist_ok=True)
    with (logs / 'preview-server.log').open('ab') as output:
        options = {'creationflags': subprocess.CREATE_NO_WINDOW} if os.name == 'nt' else {'start_new_session': True}
        process = subprocess.Popen(
            [sys.executable, '-u', str(Path(__file__).resolve()), '--serve'],
            cwd=ROOT, stdin=subprocess.DEVNULL, stdout=output, stderr=output,
            close_fds=True, **options)
    for _ in range(50):
        if ready():
            print(f'Preview started (PID {process.pid}): {URL}')
            return
        if process.poll() is not None:
            break
        time.sleep(0.1)
    raise RuntimeError('Preview did not start. See .qa/preview-server.log.')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--serve', action='store_true')
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    if args.serve:
        server = ThreadingHTTPServer((HOST, PORT), partial(PreviewHandler, directory=str(ROOT)))
        server.serve_forever()
    else:
        start()
        if not args.no_browser:
            webbrowser.open(URL)


if __name__ == '__main__':
    try:
        main()
    except (OSError, RuntimeError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
