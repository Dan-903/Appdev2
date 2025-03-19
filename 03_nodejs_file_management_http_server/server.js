const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const events = require('events')

const hostname = '127.0.0.1';
const port = 3000;
const eventEmitter = new events.EventEmitter();

// Event listeners
eventEmitter.on('fileCreated', (filename) => {
    console.log(`File created: ${filename}`);
});

eventEmitter.on('fileDeleted', (filename) => {
    console.log(`File deleted: ${filename}`);
});

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;

    const handleError = (err, res) => {
        console.error(err);
        if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(500);
            res.end('Internal server error');
        }
    };

    const validatePath = (filename) => {
        const filePath = path.resolve(__dirname, filename);
        return filePath.startsWith(__dirname);
    };

    if (pathname === '/create') {
        const { filename, content } = query;
        if (!filename || !content) {
            res.writeHead(400);
            return res.end('Missing filename or content');
        }

        if (!validatePath(filename)) {
            res.writeHead(403);
            return res.end('Forbidden path');
        }

        fs.writeFile(filename, content, (err) => {
            if (err) return handleError(err, res);
            eventEmitter.emit('fileCreated', filename);
            res.writeHead(201);
            res.end('File created successfully');
        });

    } else if (pathname === '/read') {
        const { filename } = query;
        if (!filename) {
            res.writeHead(400);
            return res.end('Missing filename');
        }

        if (!validatePath(filename)) {
            res.writeHead(403);
            return res.end('Forbidden path');
        }

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) return handleError(err, res);
            res.writeHead(200);
            res.end(data);
        });

    } else if (pathname === '/update') {
        const { filename, content } = query;
        if (!filename || !content) {
            res.writeHead(400);
            return res.end('Missing filename or content');
        }

        if (!validatePath(filename)) {
            res.writeHead(403);
            return res.end('Forbidden path');
        }

        fs.access(filename, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404);
                return res.end('File not found');
            }
            
            fs.appendFile(filename, content, (err) => {
                if (err) return handleError(err, res);
                res.writeHead(200);
                res.end('File updated successfully');
            });
        });

    } else if (pathname === '/delete') {
        const { filename } = query;
        if (!filename) {
            res.writeHead(400);
            return res.end('Missing filename');
        }

        if (!validatePath(filename)) {
            res.writeHead(403);
            return res.end('Forbidden path');
        }

        fs.unlink(filename, (err) => {
            if (err) return handleError(err, res);
            eventEmitter.emit('fileDeleted', filename);
            res.writeHead(200);
            res.end('File deleted successfully');
        });

    } else {
        res.writeHead(404);
        res.end('Route not found');
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}); 