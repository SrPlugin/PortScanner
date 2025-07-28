const net = require('net');
const http = require('http');
const https = require('https');

// Common device ports
const cameraPorts = [80, 443, 8080, 8000, 554, 1935, 9000, 37777, 37778, 37779];

/**
 * Scans a specific port on an IP address
 * @param {string} ip - The IP address to scan
 * @param {number} port - The port number to check
 * @returns {Promise<boolean>} - True if port is open, false otherwise
 */
const scanPort = (ip, port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.connect(port, ip);
    });
};

/**
 * Checks if an IP:port responds to HTTP/HTTPS requests
 * @param {string} ip - The IP address to check
 * @param {number} port - The port number to check
 * @param {boolean} isHttps - Whether to use HTTPS or HTTP
 * @returns {Promise<boolean>} - True if responds with 200 OK
 */
const checkHttpResponse = (ip, port, isHttps = false) => {
    return new Promise((resolve) => {
        const protocol = isHttps ? https : http;
        const url = `${isHttps ? 'https' : 'http'}://${ip}:${port}`;
        
        const req = protocol.get(url, { timeout: 3000 }, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
    });
};

/**
 * Scans an IP address for open device ports and checks for web interfaces
 * @param {string} ip - The IP address to scan
 * @returns {Promise<Object>} - Object containing found devices and open ports
 */
const scanCameraPorts = async (ip) => {
    console.log(`[*] Scanning devices on ${ip}`);
    const foundDevices = [];
    const openPorts = [];
    
    for (const port of cameraPorts) {
        const isOpen = await scanPort(ip, port);
        
        if (isOpen) {
            console.log(`[+] Port ${port} open`);
            openPorts.push(port);
            
            // Try HTTP
            const httpWorks = await checkHttpResponse(ip, port, false);
            if (httpWorks) {
                const url = `http://${ip}:${port}`;
                console.log(`[+] DEVICE FOUND! ${url}`);
                foundDevices.push(url);
                continue;
            }
            
            // Try HTTPS
            const httpsWorks = await checkHttpResponse(ip, port, true);
            if (httpsWorks) {
                const url = `https://${ip}:${port}`;
                console.log(`[+] DEVICE FOUND! ${url}`);
                foundDevices.push(url);
            }
        }
    }
    
    return { foundDevices, openPorts };
};

/**
 * Scans the entire local network for devices
 * Scans range 192.168.1.1 to 192.168.1.254
 * @returns {Promise<void>}
 */
const scanNetwork = async () => {
    const baseIp = "192.168.1";
    const allDevices = [];
    const allOpenPorts = {};
    
    console.log("[*] Scanning local network for devices...");
    
    for (let i = 1; i <= 254; i++) {
        const ip = `${baseIp}.${i}`;
        const { foundDevices, openPorts } = await scanCameraPorts(ip);
        
        if (foundDevices.length > 0) {
            allDevices.push(...foundDevices);
        }
        
        if (openPorts.length > 0) {
            allOpenPorts[ip] = openPorts;
        }
    }
    
    // Show results
    console.log("\n" + "=".repeat(50));
    console.log("SCAN RESULTS");
    console.log("=".repeat(50));
    
    if (allDevices.length > 0) {
        console.log(`\n[+] Devices found:`);
        allDevices.forEach(device => {
            console.log(`   ${device}`);
        });
        console.log("\nOpen these links in your browser to access the devices");
    } else {
        console.log("\n[-] No devices found on the network");
    }
    
    if (Object.keys(allOpenPorts).length > 0) {
        console.log(`\n[+] All IPs and open ports:`);
        Object.entries(allOpenPorts).forEach(([ip, ports]) => {
            console.log(`   ${ip}: ${ports.join(', ')}`);
        });
    }
    
    console.log("\n" + "=".repeat(50));
};

// Run the scan
scanNetwork().catch(console.error); 